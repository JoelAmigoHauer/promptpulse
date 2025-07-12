import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from enum import Enum

class AIProvider(Enum):
    CHATGPT = "openai/gpt-4"
    CLAUDE = "anthropic/claude-3-sonnet"
    GEMINI = "google/gemini-pro"

@dataclass
class PromptTestResult:
    provider: str
    prompt: str
    response: str
    rank_position: Optional[int]
    brand_mentions: List[str]
    competitor_mentions: List[str]
    sentiment_score: float
    confidence: float
    response_time: float
    timestamp: datetime
    citations: List[str]

@dataclass
class CompetitiveAnalysis:
    prompt: str
    results: List[PromptTestResult]
    best_performer: str
    ranking_summary: Dict[str, int]
    competitive_gaps: List[Dict[str, Any]]
    improvement_opportunities: List[str]

class OpenRouterService:
    """Service for integrating with OpenRouter API to test prompts across multiple AI providers"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://promptpulse.ai",
            "X-Title": "PromptPulse AEO Platform",
            "Content-Type": "application/json"
        }
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def test_prompt_across_providers(
        self, 
        prompt: str, 
        brand_name: str = "Tesla",
        competitors: List[str] = None
    ) -> CompetitiveAnalysis:
        """Test a prompt across ChatGPT, Claude, and Gemini to analyze competitive positioning"""
        
        if competitors is None:
            competitors = ["Ford", "GM", "Rivian", "Mercedes", "BMW"]
        
        tasks = []
        for provider in AIProvider:
            task = self._test_single_provider(prompt, provider, brand_name, competitors)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions and process results
        valid_results = [r for r in results if isinstance(r, PromptTestResult)]
        
        analysis = self._analyze_competitive_results(prompt, valid_results, brand_name, competitors)
        return analysis
    
    async def _test_single_provider(
        self, 
        prompt: str, 
        provider: AIProvider, 
        brand_name: str,
        competitors: List[str]
    ) -> PromptTestResult:
        """Test a single prompt against one AI provider"""
        
        start_time = datetime.now()
        
        # Create competitive analysis prompt
        analysis_prompt = f"""
        Query: "{prompt}"
        
        Please provide a comprehensive response to this query. I need to analyze:
        1. How {brand_name} compares to competitors like {', '.join(competitors[:3])}
        2. Specific rankings or recommendations
        3. Any citations or sources you reference
        4. Key factors that influence recommendations
        
        Please be thorough and specific in your analysis.
        """
        
        try:
            async with self.session.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": provider.value,
                    "messages": [
                        {
                            "role": "user",
                            "content": analysis_prompt
                        }
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }
            ) as response:
                
                response_time = (datetime.now() - start_time).total_seconds()
                
                if response.status == 200:
                    data = await response.json()
                    ai_response = data['choices'][0]['message']['content']
                    
                    # Analyze the response for competitive insights
                    analysis = await self._analyze_response(
                        prompt, ai_response, brand_name, competitors, provider.name
                    )
                    
                    return PromptTestResult(
                        provider=provider.name,
                        prompt=prompt,
                        response=ai_response,
                        rank_position=analysis['rank_position'],
                        brand_mentions=analysis['brand_mentions'],
                        competitor_mentions=analysis['competitor_mentions'],
                        sentiment_score=analysis['sentiment_score'],
                        confidence=analysis['confidence'],
                        response_time=response_time,
                        timestamp=datetime.now(),
                        citations=analysis['citations']
                    )
                else:
                    raise Exception(f"API error: {response.status}")
                    
        except Exception as e:
            print(f"Error testing {provider.name}: {e}")
            # Return a failed result
            return PromptTestResult(
                provider=provider.name,
                prompt=prompt,
                response=f"Error: {str(e)}",
                rank_position=None,
                brand_mentions=[],
                competitor_mentions=[],
                sentiment_score=0.0,
                confidence=0.0,
                response_time=(datetime.now() - start_time).total_seconds(),
                timestamp=datetime.now(),
                citations=[]
            )
    
    async def _analyze_response(
        self, 
        prompt: str, 
        response: str, 
        brand_name: str, 
        competitors: List[str],
        provider: str
    ) -> Dict[str, Any]:
        """Analyze AI response for competitive insights"""
        
        response_lower = response.lower()
        brand_lower = brand_name.lower()
        
        # Find brand mentions
        brand_mentions = []
        if brand_lower in response_lower:
            brand_mentions.append(brand_name)
        
        # Find competitor mentions
        competitor_mentions = []
        for competitor in competitors:
            if competitor.lower() in response_lower:
                competitor_mentions.append(competitor)
        
        # Estimate ranking position based on mention order and context
        rank_position = self._estimate_ranking_position(response, brand_name, competitors)
        
        # Calculate sentiment score
        sentiment_score = self._calculate_sentiment_score(response, brand_name)
        
        # Extract potential citations
        citations = self._extract_citations(response)
        
        # Calculate confidence based on response quality
        confidence = self._calculate_confidence(response, brand_mentions, competitor_mentions)
        
        return {
            'rank_position': rank_position,
            'brand_mentions': brand_mentions,
            'competitor_mentions': competitor_mentions,
            'sentiment_score': sentiment_score,
            'confidence': confidence,
            'citations': citations
        }
    
    def _estimate_ranking_position(self, response: str, brand_name: str, competitors: List[str]) -> Optional[int]:
        """Estimate ranking position based on mention order and context keywords"""
        
        response_lower = response.lower()
        brand_lower = brand_name.lower()
        
        # Look for explicit ranking indicators
        ranking_patterns = [
            f"{brand_lower} is the best",
            f"{brand_lower} leads",
            f"{brand_lower} tops",
            f"top choice is {brand_lower}",
            f"#1 is {brand_lower}",
            f"first place: {brand_lower}"
        ]
        
        for pattern in ranking_patterns:
            if pattern in response_lower:
                return 1
        
        # Check mention order (simplified)
        all_brands = [brand_name] + competitors
        first_mentioned = None
        
        for brand in all_brands:
            if brand.lower() in response_lower:
                first_mentioned = brand
                break
        
        if first_mentioned and first_mentioned.lower() == brand_lower:
            return 1
        elif brand_lower in response_lower:
            # Count how many competitors are mentioned before our brand
            brand_position = response_lower.find(brand_lower)
            competitors_before = 0
            
            for competitor in competitors:
                comp_position = response_lower.find(competitor.lower())
                if comp_position != -1 and comp_position < brand_position:
                    competitors_before += 1
            
            return competitors_before + 1
        
        return None
    
    def _calculate_sentiment_score(self, response: str, brand_name: str) -> float:
        """Calculate sentiment score for brand mentions (0-5 scale)"""
        
        response_lower = response.lower()
        brand_lower = brand_name.lower()
        
        if brand_lower not in response_lower:
            return 3.0  # Neutral if not mentioned
        
        # Positive indicators
        positive_words = [
            'best', 'excellent', 'superior', 'leading', 'top', 'outstanding',
            'reliable', 'innovative', 'efficient', 'advanced', 'popular',
            'recommended', 'preferred', 'winner', 'impressive', 'strong'
        ]
        
        # Negative indicators
        negative_words = [
            'worst', 'poor', 'inferior', 'problems', 'issues', 'concerns',
            'expensive', 'limited', 'lacking', 'disappointing', 'weak',
            'behind', 'struggling', 'fails', 'unable', 'difficult'
        ]
        
        # Count sentiment words near brand mentions
        positive_count = sum(1 for word in positive_words if word in response_lower)
        negative_count = sum(1 for word in negative_words if word in response_lower)
        
        # Base score
        score = 3.0
        
        # Adjust based on sentiment
        score += min(positive_count * 0.3, 2.0)
        score -= min(negative_count * 0.3, 2.0)
        
        # Ensure score is within bounds
        return max(1.0, min(5.0, score))
    
    def _extract_citations(self, response: str) -> List[str]:
        """Extract potential URL citations from response"""
        
        import re
        
        # Look for URLs
        url_pattern = r'https?://[^\s\)>]+'
        urls = re.findall(url_pattern, response)
        
        # Look for source mentions
        source_patterns = [
            r'according to ([^,\n]+)',
            r'source: ([^,\n]+)',
            r'study by ([^,\n]+)',
            r'research from ([^,\n]+)'
        ]
        
        sources = []
        for pattern in source_patterns:
            matches = re.findall(pattern, response, re.IGNORECASE)
            sources.extend(matches)
        
        return urls + sources
    
    def _calculate_confidence(
        self, 
        response: str, 
        brand_mentions: List[str], 
        competitor_mentions: List[str]
    ) -> float:
        """Calculate confidence score based on response quality"""
        
        confidence = 0.0
        
        # Response length (longer = more detailed)
        length_score = min(len(response) / 1000, 1.0) * 30
        confidence += length_score
        
        # Brand mentions
        if brand_mentions:
            confidence += 25
        
        # Competitor context
        if competitor_mentions:
            confidence += min(len(competitor_mentions) * 10, 30)
        
        # Specific details (numbers, facts)
        import re
        numbers = re.findall(r'\d+', response)
        if numbers:
            confidence += min(len(numbers) * 2, 15)
        
        return min(confidence, 100.0)
    
    def _analyze_competitive_results(
        self,
        prompt: str,
        results: List[PromptTestResult],
        brand_name: str,
        competitors: List[str]
    ) -> CompetitiveAnalysis:
        """Analyze results across all providers for competitive insights"""
        
        if not results:
            return CompetitiveAnalysis(
                prompt=prompt,
                results=[],
                best_performer="",
                ranking_summary={},
                competitive_gaps=[],
                improvement_opportunities=[]
            )
        
        # Find best performing provider
        valid_results = [r for r in results if r.rank_position is not None]
        best_performer = ""
        
        if valid_results:
            best_result = min(valid_results, key=lambda x: x.rank_position)
            best_performer = best_result.provider
        
        # Create ranking summary
        ranking_summary = {}
        for result in results:
            if result.rank_position:
                ranking_summary[result.provider] = result.rank_position
        
        # Identify competitive gaps
        competitive_gaps = []
        for result in results:
            if result.rank_position and result.rank_position > 1:
                gap = {
                    "provider": result.provider,
                    "current_rank": result.rank_position,
                    "gap_size": result.rank_position - 1,
                    "main_competitors": result.competitor_mentions[:2],
                    "opportunity_score": max(0, 100 - (result.rank_position * 15))
                }
                competitive_gaps.append(gap)
        
        # Generate improvement opportunities
        improvement_opportunities = []
        
        if ranking_summary:
            avg_rank = sum(ranking_summary.values()) / len(ranking_summary)
            if avg_rank > 2:
                improvement_opportunities.append(
                    f"Focus on {prompt} - average rank is {avg_rank:.1f}, opportunity to improve"
                )
        
        # Find most mentioned competitors
        all_competitor_mentions = []
        for result in results:
            all_competitor_mentions.extend(result.competitor_mentions)
        
        if all_competitor_mentions:
            from collections import Counter
            top_competitor = Counter(all_competitor_mentions).most_common(1)[0][0]
            improvement_opportunities.append(
                f"Challenge {top_competitor} - most frequently mentioned competitor"
            )
        
        return CompetitiveAnalysis(
            prompt=prompt,
            results=results,
            best_performer=best_performer,
            ranking_summary=ranking_summary,
            competitive_gaps=competitive_gaps,
            improvement_opportunities=improvement_opportunities
        )
    
    async def grade_content(
        self, 
        prompt: str, 
        content: str,
        brand_name: str = "Tesla"
    ) -> Dict[str, Any]:
        """Grade content performance for a specific prompt"""
        
        grading_prompt = f"""
        Analyze this content for the prompt "{prompt}" and provide detailed grading:

        CONTENT TO ANALYZE:
        {content}

        Please provide a JSON response with:
        1. overall_grade (A-F)
        2. numerical_score (0-100)
        3. authority_score (0-100) - how authoritative and expert the content appears
        4. relevance_score (0-100) - how well it matches the prompt
        5. completeness_score (0-100) - how comprehensive the coverage is
        6. strengths (array of 3-5 specific strengths)
        7. weaknesses (array of 3-5 specific areas for improvement)
        8. recommendations (array of 3-5 specific improvement suggestions)
        9. keyword_analysis (object with primary_keywords and missing_keywords arrays)
        10. competitive_analysis (how well it positions against competitors like Ford, GM, etc.)

        Focus on practical, actionable feedback for improving AI search rankings.
        """
        
        try:
            async with self.session.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": AIProvider.CLAUDE.value,  # Use Claude for content analysis
                    "messages": [
                        {
                            "role": "user", 
                            "content": grading_prompt
                        }
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.3
                }
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    ai_response = data['choices'][0]['message']['content']
                    
                    # Try to parse JSON response
                    try:
                        # Look for JSON in the response
                        import re
                        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
                        if json_match:
                            grade_data = json.loads(json_match.group())
                        else:
                            # Fallback to structured parsing
                            grade_data = self._parse_grade_response(ai_response)
                        
                        # Ensure all required fields exist
                        grade_data.setdefault('overall_grade', 'B')
                        grade_data.setdefault('numerical_score', 75)
                        grade_data.setdefault('authority_score', 70)
                        grade_data.setdefault('relevance_score', 80)
                        grade_data.setdefault('completeness_score', 75)
                        grade_data.setdefault('strengths', ["Well-structured content"])
                        grade_data.setdefault('weaknesses', ["Could be more comprehensive"])
                        grade_data.setdefault('recommendations', ["Add more specific examples"])
                        
                        return grade_data
                        
                    except json.JSONDecodeError:
                        # Fallback to basic analysis
                        return self._fallback_content_grade(content, prompt)
                
                else:
                    return self._fallback_content_grade(content, prompt)
                    
        except Exception as e:
            print(f"Error grading content: {e}")
            return self._fallback_content_grade(content, prompt)
    
    def _parse_grade_response(self, response: str) -> Dict[str, Any]:
        """Parse non-JSON grade response into structured data"""
        
        # Basic parsing logic for when JSON parsing fails
        lines = response.split('\n')
        
        grade_data = {
            'overall_grade': 'B',
            'numerical_score': 75,
            'authority_score': 70,
            'relevance_score': 80,
            'completeness_score': 75,
            'strengths': [],
            'weaknesses': [],
            'recommendations': []
        }
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if 'grade' in line.lower() and any(g in line for g in ['A', 'B', 'C', 'D', 'F']):
                # Extract grade
                for grade in ['A', 'B', 'C', 'D', 'F']:
                    if grade in line:
                        grade_data['overall_grade'] = grade
                        break
            
            elif 'strength' in line.lower():
                current_section = 'strengths'
            elif 'weakness' in line.lower() or 'improvement' in line.lower():
                current_section = 'weaknesses'
            elif 'recommend' in line.lower():
                current_section = 'recommendations'
            elif line.startswith('-') or line.startswith('•'):
                if current_section and current_section in grade_data:
                    grade_data[current_section].append(line[1:].strip())
        
        return grade_data
    
    def _fallback_content_grade(self, content: str, prompt: str) -> Dict[str, Any]:
        """Fallback content grading when API fails"""
        
        # Simple heuristic grading
        word_count = len(content.split())
        
        if word_count < 100:
            grade = 'D'
            score = 60
        elif word_count < 300:
            grade = 'C'
            score = 70
        elif word_count < 600:
            grade = 'B'
            score = 80
        else:
            grade = 'A'
            score = 90
        
        return {
            'overall_grade': grade,
            'numerical_score': score,
            'authority_score': score - 5,
            'relevance_score': score,
            'completeness_score': score - 10,
            'strengths': [
                "Content addresses the topic",
                "Appropriate length for the subject"
            ],
            'weaknesses': [
                "Could benefit from more specific examples",
                "Consider adding authoritative sources"
            ],
            'recommendations': [
                "Add specific data and statistics",
                "Include expert quotes or citations",
                "Expand on competitive comparisons"
            ]
        }

# Global service instance
openrouter_service = OpenRouterService()