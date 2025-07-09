import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import json
import re
from dataclasses import dataclass
from enum import Enum

import openai
import anthropic
import google.generativeai as genai
from ..config import settings

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
        self.openai_client = None
        self.anthropic_client = None
        self.google_client = None
        self._initialize_clients()

    def _initialize_clients(self):
        """Initialize AI service clients"""
        try:
            if settings.openai_api_key:
                self.openai_client = openai.OpenAI(api_key=settings.openai_api_key)
            
            if settings.anthropic_api_key:
                self.anthropic_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
            
            if settings.google_ai_api_key:
                genai.configure(api_key=settings.google_ai_api_key)
                self.google_client = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            logger.error(f"Failed to initialize AI clients: {e}")

    async def search_brand_mentions(self, brand_name: str, keywords: List[str]) -> BrandAnalysis:
        """Main method to search for brand mentions across all AI platforms"""
        all_mentions = []
        
        # Search across all available AI platforms
        search_tasks = []
        
        if self.openai_client:
            search_tasks.append(self._search_openai(brand_name, keywords))
        
        if self.anthropic_client:
            search_tasks.append(self._search_anthropic(brand_name, keywords))
        
        if self.google_client:
            search_tasks.append(self._search_google(brand_name, keywords))
        
        # Execute all searches concurrently
        results = await asyncio.gather(*search_tasks, return_exceptions=True)
        
        # Collect all mentions from successful searches
        for result in results:
            if isinstance(result, list):
                all_mentions.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Search failed: {result}")
        
        # Calculate brand analysis
        analysis = self._analyze_brand_visibility(brand_name, all_mentions)
        return analysis

    async def _search_openai(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        """Search for brand mentions using OpenAI GPT"""
        mentions = []
        
        try:
            # Generate search prompts
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    self.openai_client.chat.completions.create,
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a brand intelligence analyst. Provide detailed information about brand mentions, including context, sentiment, and any referenced sources."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000,
                    temperature=0.3
                )
                
                content = response.choices[0].message.content
                
                # Extract mentions from the response
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.OPENAI.value
                )
                mentions.extend(extracted_mentions)
        
        except Exception as e:
            logger.error(f"OpenAI search failed: {e}")
        
        return mentions

    async def _search_anthropic(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        """Search for brand mentions using Anthropic Claude"""
        mentions = []
        
        try:
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    self.anthropic_client.messages.create,
                    model="claude-3-haiku-20240307",
                    max_tokens=1000,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                content = response.content[0].text
                
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.ANTHROPIC.value
                )
                mentions.extend(extracted_mentions)
        
        except Exception as e:
            logger.error(f"Anthropic search failed: {e}")
        
        return mentions

    async def _search_google(self, brand_name: str, keywords: List[str]) -> List[BrandMention]:
        """Search for brand mentions using Google Gemini"""
        mentions = []
        
        try:
            search_prompts = self._generate_search_prompts(brand_name, keywords)
            
            for prompt in search_prompts:
                response = await asyncio.to_thread(
                    self.google_client.generate_content,
                    prompt
                )
                
                content = response.text
                
                extracted_mentions = self._extract_mentions_from_response(
                    content, brand_name, keywords, AIProvider.GOOGLE.value
                )
                mentions.extend(extracted_mentions)
        
        except Exception as e:
            logger.error(f"Google search failed: {e}")
        
        return mentions

    def _generate_search_prompts(self, brand_name: str, keywords: List[str]) -> List[str]:
        """Generate search prompts for AI platforms"""
        keyword_str = ", ".join(keywords)
        
        prompts = [
            f"Search your knowledge base for recent mentions, discussions, news, and information about {brand_name}. Focus on content related to: {keyword_str}. Provide specific examples with context, sentiment analysis, and any referenced sources or links.",
            
            f"What are people saying about {brand_name} in relation to {keyword_str}? Include both positive and negative mentions, recent developments, and any notable discussions or controversies.",
            
            f"Analyze the public perception and brand reputation of {brand_name}, particularly focusing on {keyword_str}. Include specific examples of mentions, customer feedback, and media coverage.",
            
            f"Find information about {brand_name} that relates to {keyword_str}. Look for product reviews, news articles, social media discussions, and expert opinions. Include source context where available.",
            
            f"What recent developments, announcements, or news stories mention {brand_name} in connection with {keyword_str}? Provide detailed summaries and sentiment analysis."
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

# Global instance
brand_intelligence = BrandIntelligenceEngine()