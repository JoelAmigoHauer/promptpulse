#!/usr/bin/env python3
"""Test OpenRouter with different AI models"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/Users/joel/Desktop/promptpulse/promptpulse-backend/.env')

def test_openrouter_models():
    """Test different AI models through OpenRouter"""
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    # Test different models
    models_to_test = [
        "openai/gpt-4o-mini",
        "anthropic/claude-3-haiku",
        "google/gemini-flash-1.5"
    ]
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    for model in models_to_test:
        print(f"\n🧪 Testing {model}...")
        
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": "What do you know about Tesla as a brand? Keep response brief."}
            ]
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                content = result["choices"][0]["message"]["content"]
                print(f"✅ {model}: SUCCESS")
                print(f"   Response: {content[:100]}...")
            else:
                print(f"❌ {model}: FAILED ({response.status_code})")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ {model}: ERROR - {e}")

if __name__ == "__main__":
    test_openrouter_models()