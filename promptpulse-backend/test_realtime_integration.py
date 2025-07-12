#!/usr/bin/env python3
"""
Test script for real-time OpenRouter API integration
Run this to validate the data flows work correctly
"""

import asyncio
import json
import os
import sys
from datetime import datetime

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from services.openrouter_service import openrouter_service

async def test_prompt_analysis():
    """Test real-time prompt analysis across AI providers"""
    print("🧪 Testing Real-Time Prompt Analysis")
    print("=" * 50)
    
    test_prompt = "best electric vehicle for families"
    brand_name = "Tesla"
    competitors = ["Ford", "GM", "Rivian"]
    
    try:
        async with openrouter_service as service:
            print(f"📝 Testing prompt: '{test_prompt}'")
            print(f"🏢 Brand: {brand_name}")
            print(f"🏆 Competitors: {', '.join(competitors)}")
            print()
            
            analysis = await service.test_prompt_across_providers(
                prompt=test_prompt,
                brand_name=brand_name,
                competitors=competitors
            )
            
            print(f"✅ Analysis completed!")
            print(f"📊 Providers tested: {len(analysis.results)}")
            print(f"🥇 Best performer: {analysis.best_performer}")
            print(f"📈 Rankings: {analysis.ranking_summary}")
            print()
            
            print("📋 Detailed Results:")
            print("-" * 30)
            
            for result in analysis.results:
                print(f"🤖 {result.provider}:")
                print(f"   Rank: #{result.rank_position or 'N/A'}")
                print(f"   Sentiment: {result.sentiment_score:.1f}/5.0")
                print(f"   Confidence: {result.confidence:.0f}%")
                print(f"   Response time: {result.response_time:.2f}s")
                print(f"   Brand mentions: {result.brand_mentions}")
                print(f"   Competitors: {result.competitor_mentions}")
                print(f"   Response: {result.response[:100]}...")
                print()
            
            if analysis.competitive_gaps:
                print("🎯 Competitive Gaps Found:")
                for gap in analysis.competitive_gaps:
                    print(f"   • {gap['provider']}: Rank #{gap['current_rank']} (Gap: {gap['gap_size']})")
            
            if analysis.improvement_opportunities:
                print("💡 Improvement Opportunities:")
                for opp in analysis.improvement_opportunities:
                    print(f"   • {opp}")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_content_grading():
    """Test real-time content grading"""
    print("\n🎓 Testing Content Grading")
    print("=" * 50)
    
    test_content = """
    Tesla Model Y is widely considered one of the best electric vehicles for families. 
    It offers excellent safety ratings, ample cargo space, and Tesla's industry-leading 
    Supercharger network. The vehicle provides up to 330 miles of range and features 
    advanced autopilot capabilities. While competitors like Ford Mustang Mach-E and 
    Volvo XC40 Recharge offer alternatives, Tesla's combination of technology, 
    performance, and charging infrastructure makes it a top choice for family buyers.
    """
    
    prompt = "best electric vehicle for families"
    
    try:
        async with openrouter_service as service:
            print(f"📝 Grading content for prompt: '{prompt}'")
            print(f"📄 Content length: {len(test_content)} characters")
            print()
            
            grade_result = await service.grade_content(
                prompt=prompt,
                content=test_content,
                brand_name="Tesla"
            )
            
            print(f"✅ Content graded!")
            print(f"🎯 Overall Grade: {grade_result.get('overall_grade', 'N/A')}")
            print(f"📊 Numerical Score: {grade_result.get('numerical_score', 0)}/100")
            print()
            
            scores = {
                'Authority': grade_result.get('authority_score', 0),
                'Relevance': grade_result.get('relevance_score', 0),
                'Completeness': grade_result.get('completeness_score', 0)
            }
            
            print("📈 Detailed Scores:")
            for metric, score in scores.items():
                print(f"   {metric}: {score}/100")
            print()
            
            if 'strengths' in grade_result:
                print("💪 Strengths:")
                for strength in grade_result['strengths'][:3]:
                    print(f"   • {strength}")
                print()
            
            if 'weaknesses' in grade_result:
                print("⚠️  Areas for Improvement:")
                for weakness in grade_result['weaknesses'][:3]:
                    print(f"   • {weakness}")
                print()
            
            if 'recommendations' in grade_result:
                print("📋 Recommendations:")
                for rec in grade_result['recommendations'][:3]:
                    print(f"   • {rec}")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_api_connectivity():
    """Test OpenRouter API connectivity"""
    print("\n🔌 Testing API Connectivity")
    print("=" * 50)
    
    api_key = os.getenv('OPENROUTER_API_KEY')
    
    if not api_key:
        print("⚠️  OPENROUTER_API_KEY not found in environment")
        print("   Set your API key with: export OPENROUTER_API_KEY=your_key_here")
        return False
    
    print(f"🔑 API Key: {api_key[:8]}...{api_key[-4:] if len(api_key) > 12 else '****'}")
    
    try:
        async with openrouter_service as service:
            # Test simple API call
            print("🧪 Testing basic API connectivity...")
            
            test_result = await service._test_single_provider(
                prompt="test connectivity",
                provider=service.ORProvider.CHATGPT,
                brand_name="Test",
                competitors=["Competitor1"]
            )
            
            if test_result.response and "Error:" not in test_result.response:
                print("✅ API connectivity successful!")
                print(f"📡 Response time: {test_result.response_time:.2f}s")
                return True
            else:
                print(f"❌ API call failed: {test_result.response}")
                return False
                
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def check_environment():
    """Check if environment is properly configured"""
    print("🔧 Checking Environment Configuration")
    print("=" * 50)
    
    required_vars = ['OPENROUTER_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
        else:
            print(f"✅ {var}: configured")
    
    if missing_vars:
        print(f"\n❌ Missing environment variables: {', '.join(missing_vars)}")
        print("\n📋 Setup Instructions:")
        print("1. Copy .env.example to .env")
        print("2. Get your OpenRouter API key from https://openrouter.ai/")
        print("3. Set OPENROUTER_API_KEY in your .env file")
        print("4. Run: source .env  # or restart your terminal")
        return False
    
    print("\n✅ Environment properly configured!")
    return True

async def run_integration_tests():
    """Run all integration tests"""
    print("🚀 PromptPulse OpenRouter Integration Tests")
    print("=" * 50)
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check environment first
    if not check_environment():
        print("\n❌ Environment check failed. Please configure before testing.")
        return
    
    # Run tests
    tests = [
        ("API Connectivity", test_api_connectivity),
        ("Prompt Analysis", test_prompt_analysis),
        ("Content Grading", test_content_grading),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            print(f"\n▶️  Running {test_name} test...")
            result = await test_func()
            results.append((test_name, result))
            
            if result:
                print(f"✅ {test_name}: PASSED")
            else:
                print(f"❌ {test_name}: FAILED")
                
        except Exception as e:
            print(f"💥 {test_name}: ERROR - {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your OpenRouter integration is ready.")
        print("\n🚀 Next Steps:")
        print("1. Start the backend: python src/main.py")
        print("2. Start the frontend: cd ../promptpulse-frontend && npm start")
        print("3. Test real-time features in the UI")
    else:
        print("⚠️  Some tests failed. Check the errors above and:")
        print("1. Verify your OpenRouter API key is correct")
        print("2. Check your internet connection")
        print("3. Ensure you have API credits remaining")

if __name__ == "__main__":
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("💡 Tip: Install python-dotenv for automatic .env loading")
        print("   pip install python-dotenv")
    
    # Run tests
    asyncio.run(run_integration_tests())