#!/usr/bin/env python3
"""
Test script for Tesla brand intelligence search
Run this to verify the complete brand search functionality
"""

import os
import sys
import asyncio
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.services.brand_intelligence import brand_intelligence

async def test_tesla_search():
    """Test Tesla brand search across all AI platforms"""
    print("🚗 Starting Tesla Brand Intelligence Search")
    print("=" * 60)
    
    # Define search parameters
    brand_name = "Tesla"
    keywords = ["electric vehicles", "Elon Musk", "autopilot", "Model 3", "Model Y", "sustainable transport"]
    
    print(f"Brand: {brand_name}")
    print(f"Keywords: {', '.join(keywords)}")
    print(f"Search started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n🔍 Searching across AI platforms...")
    
    try:
        # Perform the search
        analysis = await brand_intelligence.search_brand_mentions(brand_name, keywords)
        
        print("\n" + "=" * 60)
        print("📊 TESLA BRAND ANALYSIS RESULTS")
        print("=" * 60)
        
        # Display summary
        print(f"🎯 Total Mentions Found: {analysis.total_mentions}")
        print(f"📈 Brand Visibility Score: {analysis.visibility_score:.1f}/100")
        
        # Display sentiment distribution
        print("\n📊 Sentiment Distribution:")
        for sentiment, count in analysis.sentiment_distribution.items():
            percentage = (count / analysis.total_mentions * 100) if analysis.total_mentions > 0 else 0
            print(f"  {sentiment.replace('_', ' ').title()}: {count} ({percentage:.1f}%)")
        
        # Display metadata
        print(f"\n🤖 AI Providers Used: {', '.join(analysis.analysis_metadata.get('providers_used', []))}")
        print(f"🎯 Average Confidence: {analysis.analysis_metadata.get('avg_confidence', 0):.2f}")
        print(f"🔗 Unique Sources: {analysis.analysis_metadata.get('unique_sources', 0)}")
        
        # Display individual mentions
        print("\n" + "=" * 60)
        print("📰 INDIVIDUAL MENTIONS")
        print("=" * 60)
        
        for i, mention in enumerate(analysis.mentions[:5], 1):  # Show first 5 mentions
            print(f"\n[{i}] Provider: {mention.provider.upper()}")
            print(f"Sentiment: {mention.sentiment_label.title()} ({mention.sentiment_score}/5)")
            print(f"Confidence: {mention.confidence:.2f}")
            print(f"Keywords Found: {', '.join(mention.keywords_found)}")
            print(f"Content: {mention.content[:200]}...")
            if mention.source_urls:
                print(f"Sources: {', '.join(mention.source_urls[:2])}")
        
        if len(analysis.mentions) > 5:
            print(f"\n... and {len(analysis.mentions) - 5} more mentions")
        
        # Performance analysis
        print("\n" + "=" * 60)
        print("🔍 SEARCH PERFORMANCE ANALYSIS")
        print("=" * 60)
        
        # Calculate provider performance
        provider_stats = {}
        for mention in analysis.mentions:
            if mention.provider not in provider_stats:
                provider_stats[mention.provider] = {
                    'count': 0,
                    'avg_sentiment': 0,
                    'avg_confidence': 0
                }
            provider_stats[mention.provider]['count'] += 1
            provider_stats[mention.provider]['avg_sentiment'] += mention.sentiment_score
            provider_stats[mention.provider]['avg_confidence'] += mention.confidence
        
        for provider, stats in provider_stats.items():
            stats['avg_sentiment'] /= stats['count']
            stats['avg_confidence'] /= stats['count']
            
            print(f"{provider.upper()}:")
            print(f"  Mentions: {stats['count']}")
            print(f"  Avg Sentiment: {stats['avg_sentiment']:.1f}/5")
            print(f"  Avg Confidence: {stats['avg_confidence']:.2f}")
        
        # Brand insights
        print("\n" + "=" * 60)
        print("💡 BRAND INSIGHTS")
        print("=" * 60)
        
        # Calculate insights
        positive_ratio = (analysis.sentiment_distribution.get('positive', 0) + 
                         analysis.sentiment_distribution.get('very_positive', 0)) / max(analysis.total_mentions, 1)
        negative_ratio = (analysis.sentiment_distribution.get('negative', 0) + 
                         analysis.sentiment_distribution.get('very_negative', 0)) / max(analysis.total_mentions, 1)
        
        print(f"✅ Positive Sentiment Ratio: {positive_ratio:.1%}")
        print(f"❌ Negative Sentiment Ratio: {negative_ratio:.1%}")
        print(f"📊 Overall Brand Health: {'Strong' if positive_ratio > 0.6 else 'Moderate' if positive_ratio > 0.4 else 'Needs Attention'}")
        
        # Keyword performance
        keyword_mentions = {}
        for mention in analysis.mentions:
            for keyword in mention.keywords_found:
                keyword_mentions[keyword] = keyword_mentions.get(keyword, 0) + 1
        
        if keyword_mentions:
            print(f"\n🔑 Top Keywords:")
            sorted_keywords = sorted(keyword_mentions.items(), key=lambda x: x[1], reverse=True)
            for keyword, count in sorted_keywords[:3]:
                print(f"  {keyword}: {count} mentions")
        
        print("\n" + "=" * 60)
        print("✅ TESLA SEARCH COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Tesla search failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_json_export():
    """Test exporting results to JSON format"""
    print("\n📄 Testing JSON Export...")
    
    try:
        # Perform a smaller search for JSON export
        analysis = await brand_intelligence.search_brand_mentions("Tesla", ["Model 3"])
        
        # Convert to JSON-serializable format
        result = {
            "brand_name": analysis.brand_name,
            "total_mentions": analysis.total_mentions,
            "visibility_score": analysis.visibility_score,
            "sentiment_distribution": analysis.sentiment_distribution,
            "search_timestamp": datetime.now().isoformat(),
            "mentions": [
                {
                    "content": mention.content,
                    "sentiment_score": mention.sentiment_score,
                    "sentiment_label": mention.sentiment_label,
                    "confidence": mention.confidence,
                    "provider": mention.provider,
                    "keywords_found": mention.keywords_found,
                    "source_urls": mention.source_urls
                }
                for mention in analysis.mentions
            ]
        }
        
        # Save to file
        with open("tesla_search_results.json", "w") as f:
            json.dump(result, f, indent=2)
        
        print("✅ Results exported to tesla_search_results.json")
        return True
        
    except Exception as e:
        print(f"❌ JSON export failed: {e}")
        return False

async def main():
    """Run the Tesla search test"""
    print("🚀 Tesla Brand Intelligence Search Test\n")
    
    # Run the main search test
    search_success = await test_tesla_search()
    
    if search_success:
        # Run JSON export test
        await test_json_export()
        
        print("\n🎉 All tests completed successfully!")
        print("📁 Check tesla_search_results.json for detailed results")
        
        return True
    else:
        print("\n❌ Test failed. Please check your API keys and try again.")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)