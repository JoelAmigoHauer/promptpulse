#!/usr/bin/env python3
"""
Test script for API connections to OpenAI, Anthropic, and Google AI
Run this to verify your API keys are working correctly
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.config import settings

async def test_openai_connection():
    """Test OpenAI API connection"""
    print("🔍 Testing OpenAI API connection...")
    
    if not settings.openai_api_key:
        print("❌ OPENAI_API_KEY not found in environment variables")
        return False
    
    try:
        import openai
        client = openai.OpenAI(api_key=settings.openai_api_key)
        
        # Test with a simple completion
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say 'OpenAI connection test successful'"}],
            max_tokens=20
        )
        
        result = response.choices[0].message.content
        print(f"✅ OpenAI API: {result}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API Error: {e}")
        return False

async def test_anthropic_connection():
    """Test Anthropic API connection"""
    print("\n🔍 Testing Anthropic API connection...")
    
    if not settings.anthropic_api_key:
        print("❌ ANTHROPIC_API_KEY not found in environment variables")
        return False
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        
        # Test with a simple message
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=20,
            messages=[{"role": "user", "content": "Say 'Anthropic connection test successful'"}]
        )
        
        result = response.content[0].text
        print(f"✅ Anthropic API: {result}")
        return True
        
    except Exception as e:
        print(f"❌ Anthropic API Error: {e}")
        return False

async def test_google_connection():
    """Test Google AI API connection"""
    print("\n🔍 Testing Google AI API connection...")
    
    if not settings.google_ai_api_key:
        print("❌ GOOGLE_AI_API_KEY not found in environment variables")
        return False
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.google_ai_api_key)
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Say 'Google AI connection test successful'")
        
        result = response.text
        print(f"✅ Google AI API: {result}")
        return True
        
    except Exception as e:
        print(f"❌ Google AI API Error: {e}")
        return False

async def test_brand_intelligence_engine():
    """Test the brand intelligence engine initialization"""
    print("\n🔍 Testing Brand Intelligence Engine...")
    
    try:
        from src.services.brand_intelligence import BrandIntelligenceEngine
        
        engine = BrandIntelligenceEngine()
        
        # Check which clients are initialized
        clients_status = {
            "OpenAI": engine.openai_client is not None,
            "Anthropic": engine.anthropic_client is not None,
            "Google": engine.google_client is not None
        }
        
        print("Brand Intelligence Engine Status:")
        for provider, status in clients_status.items():
            status_icon = "✅" if status else "❌"
            print(f"  {status_icon} {provider}: {'Initialized' if status else 'Not initialized'}")
        
        active_providers = sum(clients_status.values())
        if active_providers > 0:
            print(f"✅ Brand Intelligence Engine ready with {active_providers} provider(s)")
            return True
        else:
            print("❌ Brand Intelligence Engine: No providers available")
            return False
            
    except Exception as e:
        print(f"❌ Brand Intelligence Engine Error: {e}")
        return False

async def main():
    """Run all API connection tests"""
    print("🚀 Starting API Connection Tests for PromptPulse Brand Intelligence\n")
    print("=" * 60)
    
    # Test individual APIs
    openai_ok = await test_openai_connection()
    anthropic_ok = await test_anthropic_connection()
    google_ok = await test_google_connection()
    
    print("\n" + "=" * 60)
    
    # Test the brand intelligence engine
    engine_ok = await test_brand_intelligence_engine()
    
    print("\n" + "=" * 60)
    print("📊 SUMMARY:")
    print(f"OpenAI API: {'✅ Working' if openai_ok else '❌ Failed'}")
    print(f"Anthropic API: {'✅ Working' if anthropic_ok else '❌ Failed'}")
    print(f"Google AI API: {'✅ Working' if google_ok else '❌ Failed'}")
    print(f"Brand Intelligence Engine: {'✅ Ready' if engine_ok else '❌ Not Ready'}")
    
    total_working = sum([openai_ok, anthropic_ok, google_ok])
    print(f"\n🎯 {total_working}/3 API providers working")
    
    if total_working == 0:
        print("\n⚠️  No API providers are working. Please check your API keys.")
        return False
    elif total_working < 3:
        print(f"\n⚠️  Only {total_working} API provider(s) working. Brand search will use available providers.")
    else:
        print("\n🎉 All API providers working! Ready for full brand intelligence searches.")
    
    return engine_ok

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)