import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import re
from dataclasses import dataclass
from enum import Enum
import os
import aiohttp
import hashlib
import time
from ..config import settings
from .openrouter_service import openrouter_service, AIProvider as ORProvider, PromptTestResult

OPENROUTER_API_KEY = settings.openrouter_api_key
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

async def call_openrouter_async(messages, model):
    """Async version of OpenRouter API call"""
    async with openrouter_service as service:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://promptpulse.ai",
            "X-Title": "PromptPulse AEO Platform",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        async with service.session.post(OPENROUTER_URL, headers=headers, json=payload) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"OpenRouter API error: {response.status}")

def call_openrouter(messages, model):
    """Sync wrapper for backward compatibility"""
    import requests
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": messages
    }
    response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    return response.json()

logger = logging.getLogger(__name__)

class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"

class SentimentScore(Enum):
    VERY_POSITIVE = 5
    POSITIVE = 4
    NEUTRAL = 3
    NEGATIVE = 2
    VERY_NEGATIVE = 1

@dataclass
class BrandMention:
    content: str
    sentiment_score: int
    sentiment_label: str
    confidence: float
    source_urls: List[str]
    context: str
    provider: str
    timestamp: datetime
    keywords_found: List[str]

@dataclass
class BrandAnalysis:
    brand_name: str
    total_mentions: int
    sentiment_distribution: Dict[str, int]
    visibility_score: float
    mentions: List[BrandMention]
    analysis_metadata: Dict[str, Any]

class BrandIntelligenceEngine:
    def __init__(self):
        self.cache = {}  # Simple in-memory cache
        self.rate_limit = {}  # Track API calls per minute
        self.cache_duration = 3600  # 1 hour cache
        self.max_calls_per_minute = 10  # Rate limit

    async def search_brand_mentions(self, brand_name: str, keywords: List[str]) -> BrandAnalysis:
        """Main method to search for brand mentions across all AI platforms"""
        
        # Check cache first
        cache_key = self._generate_cache_key(brand_name, keywords)
        cached_result = self._get_from_cache(cache_key)
        if cached_result:
            logger.info(f"Returning cached result for {brand_name}")
            return cached_result
        
        # Check rate limit
        if not self._check_rate_limit():
            logger.warning("Rate limit exceeded, returning limited results")
            return self._create_limited_result(brand_name)
        
        all_mentions = []
        search_tasks = [
            self._search_openai(brand_name, keywords),
            self._search_anthropic(brand_name, keywords),
            self._search_google(brand_name, keywords)
        ]
        results = await asyncio.gather(*search_tasks, return_exceptions=True)
        for i, result in enumerate(results):
            provider_names = ["OpenAI", "Anthropic", "Google"]
            if isinstance(result, list):
                logger.info(f"{provider_names[i]} search returned {len(result)} mentions")
                all_mentions.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"{provider_names[i]} search failed: {result}")
        
        analysis = self._analyze_brand_visibility(brand_name, all_mentions)
        
        # Cache the result
        self._cache_result(cache_key, analysis)
        
        return analysis

    async def _search_openai(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        mentions = []
        try:
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    call_openrouter,
                    [
                        {"role": "system", "content": "You are a brand intelligence analyst. Provide detailed information about brand mentions, including context, sentiment, and any referenced sources."},
                        {"role": "user", "content": prompt}
                    ],
                    "openai/gpt-4o-mini"
                )
                content = response["choices"][0]["message"]["content"]
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.OPENAI.value
                )
                mentions.extend(extracted_mentions)
        except Exception as e:
            logger.error(f"OpenAI search failed: {e}")
        return mentions

    async def _search_anthropic(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        mentions = []
        try:
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    call_openrouter,
                    [
                        {"role": "user", "content": prompt}
                    ],
                    "anthropic/claude-3-haiku"
                )
                content = response["choices"][0]["message"]["content"]
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.ANTHROPIC.value
                )
                mentions.extend(extracted_mentions)
        except Exception as e:
            logger.error(f"Anthropic search failed: {e}")
        return mentions

    async def _search_google(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        mentions = []
        try:
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    call_openrouter,
                    [
                        {"role": "user", "content": prompt}
                    ],
                    "google/gemini-flash-1.5"
                )
                content = response["choices"][0]["message"]["content"]
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.GOOGLE.value
                )
                mentions.extend(extracted_mentions)
        except Exception as e:
            logger.error(f"Google search failed: {e}")
        return mentions

    def _generate_search_prompts(self, brand_name: str, keywords: List[str]) -> List[str]:
        """Generate search prompts for AI platforms - optimized for cost"""
        keyword_str = ", ".join(keywords)
        
        # Single optimized prompt per provider for cost efficiency
        prompts = [
            f"Analyze {brand_name} brand reputation: key strengths, weaknesses, recent developments, and public sentiment. Be concise but comprehensive."
        ]
        
        return prompts

    def _extract_mentions_from_response(self, response_text: str, brand_name: str, keywords: List[str], provider: str) -> List[BrandMention]:
        """Extract brand mentions from AI response text"""
        mentions = []
        
        # Split response into paragraphs/sections
        sections = response_text.split('\n\n')
        
        for section in sections:
            if not section.strip():
                continue
                
            # Check if brand name is mentioned in this section
            if brand_name.lower() in section.lower():
                # Extract URLs from the section
                urls = self._extract_urls(section)
                
                # Find keywords mentioned
                keywords_found = [kw for kw in keywords if kw.lower() in section.lower()]
                
                # Analyze sentiment
                sentiment_data = self._analyze_sentiment(section)
                
                mention = BrandMention(
                    content=section.strip(),
                    sentiment_score=sentiment_data['score'],
                    sentiment_label=sentiment_data['label'],
                    confidence=sentiment_data['confidence'],
                    source_urls=urls,
                    context=section[:200] + "..." if len(section) > 200 else section,
                    provider=provider,
                    timestamp=datetime.now(),
                    keywords_found=keywords_found
                )
                
                mentions.append(mention)
        
        return mentions

    def _extract_urls(self, text: str) -> List[str]:
        """Extract URLs from text"""
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        urls = re.findall(url_pattern, text)
        return urls

    def _analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text using keyword-based approach"""
        text_lower = text.lower()
        
        # Positive indicators
        positive_words = ['good', 'great', 'excellent', 'amazing', 'outstanding', 'innovative', 'successful', 'leading', 'best', 'love', 'like', 'recommend', 'impressed', 'satisfied', 'happy', 'pleased']
        
        # Negative indicators
        negative_words = ['bad', 'terrible', 'awful', 'poor', 'disappointed', 'failed', 'problem', 'issue', 'concern', 'criticism', 'hate', 'dislike', 'worst', 'dissatisfied', 'angry', 'frustrated']
        
        # Neutral indicators
        neutral_words = ['announced', 'reported', 'stated', 'said', 'according', 'mentioned', 'noted', 'indicated', 'described', 'explained']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        neutral_count = sum(1 for word in neutral_words if word in text_lower)
        
        total_sentiment_words = positive_count + negative_count + neutral_count
        
        if total_sentiment_words == 0:
            return {'score': 3, 'label': 'neutral', 'confidence': 0.5}
        
        # Calculate sentiment score
        if positive_count > negative_count:
            score = 4 if positive_count > negative_count * 2 else 4
            label = 'positive'
            confidence = min(0.9, 0.6 + (positive_count - negative_count) / total_sentiment_words)
        elif negative_count > positive_count:
            score = 2 if negative_count > positive_count * 2 else 2
            label = 'negative'
            confidence = min(0.9, 0.6 + (negative_count - positive_count) / total_sentiment_words)
        else:
            score = 3
            label = 'neutral'
            confidence = 0.6
        
        return {
            'score': score,
            'label': label,
            'confidence': confidence
        }

    def _analyze_brand_visibility(self, brand_name: str, mentions: List[BrandMention]) -> BrandAnalysis:
        """Analyze brand visibility and generate comprehensive report"""
        if not mentions:
            return BrandAnalysis(
                brand_name=brand_name,
                total_mentions=0,
                sentiment_distribution={'positive': 0, 'neutral': 0, 'negative': 0},
                visibility_score=0.0,
                mentions=[],
                analysis_metadata={'providers_used': [], 'search_timestamp': datetime.now()}
            )
        
        # Calculate sentiment distribution
        sentiment_distribution = {
            'very_positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very_negative': 0
        }
        
        for mention in mentions:
            if mention.sentiment_score == 5:
                sentiment_distribution['very_positive'] += 1
            elif mention.sentiment_score == 4:
                sentiment_distribution['positive'] += 1
            elif mention.sentiment_score == 3:
                sentiment_distribution['neutral'] += 1
            elif mention.sentiment_score == 2:
                sentiment_distribution['negative'] += 1
            elif mention.sentiment_score == 1:
                sentiment_distribution['very_negative'] += 1
        
        # Calculate visibility score
        visibility_score = self._calculate_visibility_score(mentions, sentiment_distribution)
        
        # Get providers used
        providers_used = list(set(mention.provider for mention in mentions))
        
        return BrandAnalysis(
            brand_name=brand_name,
            total_mentions=len(mentions),
            sentiment_distribution=sentiment_distribution,
            visibility_score=visibility_score,
            mentions=mentions,
            analysis_metadata={
                'providers_used': providers_used,
                'search_timestamp': datetime.now(),
                'avg_confidence': sum(m.confidence for m in mentions) / len(mentions),
                'unique_sources': len(set(url for m in mentions for url in m.source_urls))
            }
        )

    def _calculate_visibility_score(self, mentions: List[BrandMention], sentiment_dist: Dict[str, int]) -> float:
        """Calculate brand visibility score (0-100)"""
        if not mentions:
            return 0.0
        
        # Base score from mention volume
        volume_score = min(50, len(mentions) * 2)  # Max 50 points for volume
        
        # Sentiment score (weighted)
        total_mentions = len(mentions)
        positive_weight = (sentiment_dist['very_positive'] * 1.0 + sentiment_dist['positive'] * 0.8) / total_mentions
        negative_weight = (sentiment_dist['very_negative'] * 1.0 + sentiment_dist['negative'] * 0.8) / total_mentions
        neutral_weight = sentiment_dist['neutral'] / total_mentions
        
        sentiment_score = (positive_weight * 30) + (neutral_weight * 15) - (negative_weight * 10)
        
        # Confidence boost
        avg_confidence = sum(m.confidence for m in mentions) / len(mentions)
        confidence_score = avg_confidence * 10
        
        # Source diversity boost
        unique_sources = len(set(url for m in mentions for url in m.source_urls))
        source_score = min(10, unique_sources * 2)
        
        total_score = volume_score + sentiment_score + confidence_score + source_score
        return min(100.0, max(0.0, total_score))

    def _generate_cache_key(self, brand_name: str, keywords: List[str]) -> str:
        """Generate a cache key for the search"""
        content = f"{brand_name}:{':'.join(sorted(keywords))}"
        return hashlib.md5(content.encode()).hexdigest()

    def _get_from_cache(self, cache_key: str) -> Optional[BrandAnalysis]:
        """Get result from cache if it exists and is not expired"""
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.cache_duration:
                return cached_data
            else:
                # Remove expired cache entry
                del self.cache[cache_key]
        return None

    def _cache_result(self, cache_key: str, analysis: BrandAnalysis):
        """Cache the analysis result"""
        self.cache[cache_key] = (analysis, time.time())

    def _check_rate_limit(self) -> bool:
        """Check if we're within rate limits"""
        current_minute = int(time.time() / 60)
        if current_minute not in self.rate_limit:
            self.rate_limit[current_minute] = 0
        
        # Clean old entries
        for minute in list(self.rate_limit.keys()):
            if minute < current_minute - 1:
                del self.rate_limit[minute]
        
        if self.rate_limit[current_minute] >= self.max_calls_per_minute:
            return False
        
        self.rate_limit[current_minute] += 1
        return True

    def _create_limited_result(self, brand_name: str) -> BrandAnalysis:
        """Create a limited result when rate limited"""
        return BrandAnalysis(
            brand_name=brand_name,
            total_mentions=0,
            sentiment_distribution={'positive': 0, 'neutral': 0, 'negative': 0},
            visibility_score=0.0,
            mentions=[],
            analysis_metadata={
                'providers_used': [],
                'search_timestamp': datetime.now(),
                'rate_limited': True,
                'message': 'Rate limit exceeded. Please try again in a minute.'
            }
        )

# Global instance
brand_intelligence = BrandIntelligenceEngine()