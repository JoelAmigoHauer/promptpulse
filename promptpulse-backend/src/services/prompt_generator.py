from typing import List, Dict, Any
from enum import Enum
from datetime import datetime

class PromptType(Enum):
    GENERAL_SEARCH = "general_search"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    REPUTATION_ANALYSIS = "reputation_analysis"
    COMPETITIVE_ANALYSIS = "competitive_analysis"
    PRODUCT_FEEDBACK = "product_feedback"
    NEWS_MONITORING = "news_monitoring"
    SOCIAL_SENTIMENT = "social_sentiment"

class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"

class BrandPromptGenerator:
    """Generate optimized prompts for different AI platforms and search types"""
    
    def __init__(self):
        self.base_prompts = {
            PromptType.GENERAL_SEARCH: {
                "system": "You are a brand intelligence analyst. Search your knowledge base for information about brands and provide structured, factual responses with source attribution when possible.",
                "templates": [
                    "Search for recent mentions and discussions about {brand_name}. Focus on content related to: {keywords}. Provide specific examples with context, sentiment, and any referenced sources.",
                    "What information do you have about {brand_name} in relation to {keywords}? Include recent developments, public perception, and notable discussions.",
                    "Find content about {brand_name} that mentions {keywords}. Look for news articles, reviews, discussions, and expert opinions with source context."
                ]
            },
            PromptType.SENTIMENT_ANALYSIS: {
                "system": "You are a sentiment analysis expert. Analyze brand mentions and provide detailed sentiment breakdowns with confidence scores.",
                "templates": [
                    "Analyze public sentiment about {brand_name} particularly focusing on {keywords}. Provide specific examples of positive, negative, and neutral mentions with sentiment scores.",
                    "What are people saying about {brand_name} in relation to {keywords}? Include both praise and criticism with detailed sentiment analysis.",
                    "Evaluate the emotional tone and public perception of {brand_name} regarding {keywords}. Provide sentiment classification and confidence levels."
                ]
            },
            PromptType.REPUTATION_ANALYSIS: {
                "system": "You are a brand reputation analyst. Assess brand reputation and provide comprehensive analysis of brand perception.",
                "templates": [
                    "Analyze the brand reputation of {brand_name} focusing on {keywords}. Include reputation factors, trust indicators, and public perception trends.",
                    "What is the current reputation status of {brand_name} regarding {keywords}? Include both strengths and areas of concern.",
                    "Evaluate {brand_name}'s reputation in relation to {keywords}. Provide reputation scoring and key reputation drivers."
                ]
            },
            PromptType.COMPETITIVE_ANALYSIS: {
                "system": "You are a competitive intelligence analyst. Compare brands and analyze market positioning.",
                "templates": [
                    "Compare {brand_name} with its competitors in relation to {keywords}. Analyze market positioning, competitive advantages, and market perception.",
                    "How does {brand_name} compare to competitors regarding {keywords}? Include market share insights and competitive differentiation.",
                    "Analyze the competitive landscape for {brand_name} focusing on {keywords}. Provide competitive positioning and market dynamics."
                ]
            },
            PromptType.PRODUCT_FEEDBACK: {
                "system": "You are a product feedback analyst. Analyze customer feedback and product-related discussions.",
                "templates": [
                    "Analyze customer feedback and reviews for {brand_name} products related to {keywords}. Include specific feedback examples and satisfaction trends.",
                    "What are customers saying about {brand_name} products in relation to {keywords}? Include both positive and negative feedback with details.",
                    "Evaluate product-related discussions about {brand_name} focusing on {keywords}. Provide feedback analysis and improvement suggestions."
                ]
            },
            PromptType.NEWS_MONITORING: {
                "system": "You are a news monitoring analyst. Track news coverage and media mentions of brands.",
                "templates": [
                    "Find recent news coverage and media mentions of {brand_name} related to {keywords}. Include news sources, headlines, and article summaries.",
                    "What news stories mention {brand_name} in connection with {keywords}? Provide news analysis and media coverage trends.",
                    "Monitor media coverage of {brand_name} focusing on {keywords}. Include press releases, news articles, and media sentiment."
                ]
            },
            PromptType.SOCIAL_SENTIMENT: {
                "system": "You are a social media analyst. Analyze social media discussions and sentiment trends.",
                "templates": [
                    "Analyze social media discussions about {brand_name} related to {keywords}. Include platform-specific insights and trending topics.",
                    "What are people saying about {brand_name} on social media regarding {keywords}? Include viral content and engagement patterns.",
                    "Evaluate social media sentiment for {brand_name} focusing on {keywords}. Provide platform analysis and engagement metrics."
                ]
            }
        }
    
    def generate_search_prompts(self, 
                              brand_name: str, 
                              keywords: List[str], 
                              prompt_types: List[PromptType] = None,
                              ai_provider: AIProvider = AIProvider.OPENAI) -> List[Dict[str, Any]]:
        """Generate search prompts for brand intelligence analysis"""
        
        if prompt_types is None:
            prompt_types = [PromptType.GENERAL_SEARCH, PromptType.SENTIMENT_ANALYSIS, PromptType.REPUTATION_ANALYSIS]
        
        prompts = []
        keyword_str = ", ".join(keywords)
        
        for prompt_type in prompt_types:
            prompt_config = self.base_prompts[prompt_type]
            
            for template in prompt_config["templates"]:
                formatted_prompt = template.format(
                    brand_name=brand_name,
                    keywords=keyword_str
                )
                
                # Customize for AI provider
                if ai_provider == AIProvider.ANTHROPIC:
                    formatted_prompt = self._customize_for_anthropic(formatted_prompt, prompt_config["system"])
                elif ai_provider == AIProvider.GOOGLE:
                    formatted_prompt = self._customize_for_google(formatted_prompt, prompt_config["system"])
                
                prompts.append({
                    "prompt": formatted_prompt,
                    "system": prompt_config["system"],
                    "type": prompt_type.value,
                    "provider": ai_provider.value,
                    "brand_name": brand_name,
                    "keywords": keywords
                })
        
        return prompts
    
    def generate_sentiment_analysis_prompt(self, content: str, brand_name: str) -> str:
        """Generate a prompt for sentiment analysis of specific content"""
        return f"""
        Analyze the sentiment of the following content about {brand_name}:
        
        Content: "{content}"
        
        Provide:
        1. Sentiment classification (very positive, positive, neutral, negative, very negative)
        2. Confidence score (0-1)
        3. Key sentiment indicators
        4. Emotional tone analysis
        5. Context-specific sentiment factors
        
        Format as JSON with sentiment_score (1-5), sentiment_label, confidence, and reasoning.
        """
    
    def generate_competitive_analysis_prompt(self, brand_name: str, competitors: List[str], keywords: List[str]) -> str:
        """Generate a prompt for competitive brand analysis"""
        competitor_str = ", ".join(competitors)
        keyword_str = ", ".join(keywords)
        
        return f"""
        Conduct a competitive analysis of {brand_name} against competitors: {competitor_str}
        Focus on these areas: {keyword_str}
        
        Provide:
        1. Market positioning comparison
        2. Competitive advantages and disadvantages
        3. Brand perception differences
        4. Market share insights (if available)
        5. Competitive differentiation factors
        6. Recommendations for {brand_name}
        
        Structure the response with clear sections for each competitor and analysis dimension.
        """
    
    def generate_trend_analysis_prompt(self, brand_name: str, keywords: List[str], time_period: str = "recent") -> str:
        """Generate a prompt for trend analysis"""
        keyword_str = ", ".join(keywords)
        
        return f"""
        Analyze {time_period} trends for {brand_name} related to {keyword_str}:
        
        Provide:
        1. Emerging trends and patterns
        2. Sentiment trend analysis
        3. Topic trend evolution
        4. Market trend implications
        5. Predictive insights
        6. Trend-based recommendations
        
        Include specific examples and data points to support trend analysis.
        """
    
    def _customize_for_anthropic(self, prompt: str, system_message: str) -> str:
        """Customize prompts for Anthropic Claude"""
        return f"""Human: {system_message}

{prompt}

Please provide detailed, structured responses with specific examples and clear analysis. Format your response with clear sections and bullet points where appropriate."""
    
    def _customize_for_google(self, prompt: str, system_message: str) -> str:
        """Customize prompts for Google Gemini"""
        return f"""{system_message}

{prompt}

Please provide comprehensive, well-structured responses with specific examples and actionable insights. Use clear formatting and organize information logically."""