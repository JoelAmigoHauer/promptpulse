#!/usr/bin/env python3
"""Test script for OpenRouter integration"""

import asyncio
import sys
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv('/Users/joel/Desktop/promptpulse/promptpulse-backend/.env')

# Simple test without complex imports
def test_openrouter_simple():
    """Simple test of OpenRouter API"""
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    print(f"Testing OpenRouter API with key: {api_key[:20]}...")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "user", "content": "What do you know about Tesla as a brand? Keep it brief."}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        
        print("✅ OpenRouter API test successful!")
        print(f"Response: {content[:200]}...")
        return True
        
    except Exception as e:
        print(f"❌ OpenRouter API test failed: {e}")
        return False

async def test_openrouter_connection():
    """Test OpenRouter connection with a simple brand search"""
    print("Testing OpenRouter connection...")
    
    # Initialize the brand intelligence engine
    engine = BrandIntelligenceEngine()
    
    # Test with a well-known brand
    brand_name = "Tesla"
    keywords = ["electric vehicles", "innovation", "sustainability"]
    
    print(f"Searching for brand: {brand_name}")
    print(f"Keywords: {keywords}")
    print("-" * 50)
    
    try:
        # Perform the search
        results = await engine.search_brand_mentions(brand_name, keywords)
        
        print(f"✅ Search completed successfully!")
        print(f"Total mentions found: {results.total_mentions}")
        print(f"Visibility score: {results.visibility_score:.2f}")
        print(f"Sentiment distribution: {results.sentiment_distribution}")
        print(f"Providers used: {results.analysis_metadata.get('providers_used', [])}")
        
        # Show first few mentions
        if results.mentions:
            print("\n📝 Sample mentions:")
            for i, mention in enumerate(results.mentions[:3]):
                print(f"\n{i+1}. Provider: {mention.provider}")
                print(f"   Sentiment: {mention.sentiment_label} (Score: {mention.sentiment_score})")
                print(f"   Content: {mention.content[:150]}...")
                print(f"   Keywords found: {mention.keywords_found}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during search: {e}")
        return False

if __name__ == "__main__":
    success = test_openrouter_simple()
    if success:
        print("\n🎉 OpenRouter integration test passed!")
    else:
        print("\n💥 OpenRouter integration test failed!")
        sys.exit(1)