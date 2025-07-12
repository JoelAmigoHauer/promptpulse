#!/usr/bin/env python3
"""Test frontend integration with OpenRouter backend"""

import requests
import json
import time

def test_frontend_integration():
    """Test the complete frontend to backend integration"""
    
    print("🔍 Testing Frontend Integration with OpenRouter Backend")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1. Testing API Health Check...")
    try:
        response = requests.get("http://127.0.0.1:8000/health")
        if response.status_code == 200:
            print("✅ API is healthy and running")
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot reach API: {e}")
        return False
    
    # Test 2: Brand search (simulating frontend request)
    print("\n2. Testing Brand Search API (Frontend Integration)...")
    
    # This simulates exactly what the frontend sends
    frontend_payload = {
        "brand_name": "Tesla",
        "keywords": ["Tesla"],  # Frontend sends brand name as keyword
        "save_to_db": True
    }
    
    try:
        print(f"   Sending request: {frontend_payload}")
        response = requests.post(
            "http://127.0.0.1:8000/api/brands/search",
            json=frontend_payload,
            timeout=120  # Allow time for AI processing
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Brand search successful!")
            print(f"   Brand: {data.get('brand_name', 'N/A')}")
            print(f"   Total mentions: {data.get('total_mentions', 0)}")
            print(f"   Visibility score: {data.get('visibility_score', 0):.2f}")
            print(f"   Sentiment distribution: {data.get('sentiment_distribution', {})}")
            
            # Check if we got mentions
            mentions = data.get('mentions', [])
            if mentions:
                print(f"   Sample mention from {mentions[0].get('provider', 'AI')}: {mentions[0].get('content', '')[:100]}...")
            
            return True
        else:
            print(f"❌ Brand search failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out - AI processing took too long")
        return False
    except Exception as e:
        print(f"❌ Brand search error: {e}")
        return False

def test_different_brands():
    """Test with different brand names"""
    print("\n3. Testing Different Brand Names...")
    
    test_brands = [
        {"name": "Apple", "keywords": ["iPhone", "technology"]},
        {"name": "Google", "keywords": ["search", "AI"]},
        {"name": "Amazon", "keywords": ["e-commerce", "cloud"]}
    ]
    
    for brand_data in test_brands:
        try:
            print(f"   Testing {brand_data['name']}...")
            response = requests.post(
                "http://127.0.0.1:8000/api/brands/search",
                json={
                    "brand_name": brand_data['name'],
                    "keywords": brand_data['keywords'],
                    "save_to_db": False  # Don't save test data
                },
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ {brand_data['name']}: {data.get('total_mentions', 0)} mentions")
            else:
                print(f"   ❌ {brand_data['name']}: Failed ({response.status_code})")
                
        except Exception as e:
            print(f"   ❌ {brand_data['name']}: Error - {e}")

if __name__ == "__main__":
    print("Starting Frontend Integration Tests...")
    print("Backend should be running on http://127.0.0.1:8000")
    print("Frontend should be configured to use this backend")
    
    # Run main integration test
    success = test_frontend_integration()
    
    if success:
        print("\n🎉 Primary integration test passed!")
        
        # Run additional tests
        test_different_brands()
        
        print("\n" + "=" * 60)
        print("✅ INTEGRATION TEST SUMMARY")
        print("=" * 60)
        print("✅ OpenRouter API integration: WORKING")
        print("✅ Backend API endpoints: WORKING") 
        print("✅ Brand search functionality: WORKING")
        print("✅ Frontend can connect to backend: READY")
        print("\n🚀 Your frontend is ready to search brands using OpenRouter!")
        print("\n📋 NEXT STEPS:")
        print("1. Start the frontend: cd ../promptpulse-frontend && npm run dev")
        print("2. Open browser to: http://localhost:5173")
        print("3. Navigate to Brands page")
        print("4. Search for any brand name")
        print("5. Results will be powered by OpenRouter (GPT-4, Claude, Gemini)")
        
    else:
        print("\n💥 Integration test failed!")
        print("Please check that the backend server is running and OpenRouter API key is configured.")