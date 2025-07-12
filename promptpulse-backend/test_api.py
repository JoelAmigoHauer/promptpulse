#!/usr/bin/env python3
"""Test the API endpoint for brand search"""

import requests
import json

def test_brand_search_api():
    """Test the brand search API endpoint"""
    
    base_url = "http://localhost:8000"
    
    # Test brand search endpoint
    search_data = {
        "brand_name": "Tesla",
        "keywords": ["electric vehicles", "innovation", "sustainability"]
    }
    
    print(f"Testing brand search API...")
    print(f"URL: {base_url}/api/brands/search")
    print(f"Data: {search_data}")
    
    try:
        response = requests.post(
            f"{base_url}/api/brands/search",
            json=search_data,
            timeout=60
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Brand search API test successful!")
            print(f"Total mentions: {result.get('total_mentions', 0)}")
            print(f"Visibility score: {result.get('visibility_score', 0)}")
            print(f"Sentiment distribution: {result.get('sentiment_distribution', {})}")
            return True
        else:
            print(f"❌ API returned error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_brand_search_api()
    if success:
        print("\n🎉 API test passed!")
    else:
        print("\n💥 API test failed!")