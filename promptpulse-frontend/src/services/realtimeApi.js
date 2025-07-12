/**
 * Real-time API service for OpenRouter integration
 * Handles live prompt testing, content grading, and competitive analysis
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class RealtimeApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isConnected = false;
  }

  /**
   * Test a prompt across ChatGPT, Claude, and Gemini in real-time
   */
  async testPrompt(prompt, brandName = 'Tesla', competitors = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/brands/test-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          brand_name: brandName,
          competitors: competitors || ['Ford', 'GM', 'Rivian', 'Mercedes', 'BMW']
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform data for frontend consumption
      return {
        prompt,
        brandName,
        testTimestamp: data.test_timestamp,
        providersTestedCount: data.providers_tested,
        bestPerformer: data.best_performer,
        rankings: data.ranking_summary,
        competitiveGaps: data.competitive_gaps,
        opportunities: data.improvement_opportunities,
        results: data.detailed_results.map(result => ({
          provider: result.provider,
          rank: result.rank_position,
          sentiment: result.sentiment_score,
          confidence: result.confidence,
          responseTime: result.response_time,
          brandMentions: result.brand_mentions,
          competitorMentions: result.competitor_mentions,
          citations: result.citations,
          excerpt: result.response_excerpt
        })),
        success: true
      };

    } catch (error) {
      console.error('Error testing prompt:', error);
      return {
        prompt,
        brandName,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Grade content performance using AI analysis
   */
  async gradeContent(prompt, content, brandName = 'Tesla') {
    try {
      const response = await fetch(`${this.baseURL}/api/brands/grade-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          content,
          brand_name: brandName
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        prompt,
        brandName,
        overallGrade: data.overall_grade,
        numericalScore: data.numerical_score,
        scores: {
          authority: data.authority_score,
          relevance: data.relevance_score,
          completeness: data.completeness_score
        },
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        recommendations: data.recommendations || [],
        keywordAnalysis: data.keyword_analysis || {},
        competitiveAnalysis: data.competitive_analysis,
        contentLength: data.content_length,
        wordCount: data.word_count,
        gradedAt: data.graded_at,
        success: true
      };

    } catch (error) {
      console.error('Error grading content:', error);
      return {
        prompt,
        content,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Get real-time brand mentions across AI platforms
   */
  async getRealtimeMentions(brandName = 'Tesla', prompts = null, limit = 10) {
    try {
      const queryParams = new URLSearchParams({
        brand_name: brandName,
        limit: limit.toString()
      });

      if (prompts && prompts.length > 0) {
        prompts.forEach(prompt => queryParams.append('prompts', prompt));
      }

      const response = await fetch(`${this.baseURL}/api/brands/realtime-mentions?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        brandName,
        summary: {
          totalMentions: data.summary.total_mentions,
          positiveSentiment: data.summary.positive_sentiment,
          neutralSentiment: data.summary.neutral_sentiment,
          negativeSentiment: data.summary.negative_sentiment,
          sentimentScore: data.summary.sentiment_score,
          trendingTopics: data.summary.trending_topics,
          mentionsToday: data.summary.mentions_today,
          growth24h: data.summary.growth_24h
        },
        mentions: data.mentions.map(mention => ({
          id: mention.id,
          content: mention.content,
          source: mention.source,
          prompt: mention.prompt,
          sentiment: mention.sentiment,
          sentimentScore: mention.sentiment_score,
          timestamp: new Date(mention.timestamp),
          context: mention.context,
          competitorsMentioned: mention.competitors_mentioned,
          rankPosition: mention.rank_position,
          confidence: mention.confidence
        })),
        realTimeFeed: data.real_time_feed,
        success: true
      };

    } catch (error) {
      console.error('Error fetching real-time mentions:', error);
      return {
        brandName,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Test API connectivity and health
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/api/brands/`);
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.error('API connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Simulate competitive analysis for dashboard
   */
  async runCompetitiveAnalysis(prompts, brandName = 'Tesla') {
    try {
      const results = [];
      
      // Test multiple prompts in parallel (limited to avoid rate limits)
      const promptsToTest = prompts.slice(0, 3);
      const testPromises = promptsToTest.map(prompt => 
        this.testPrompt(prompt, brandName)
      );

      const responses = await Promise.allSettled(testPromises);
      
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.success) {
          results.push({
            prompt: promptsToTest[index],
            ...response.value
          });
        }
      });

      // Aggregate results
      const aggregatedData = {
        promptsAnalyzed: results.length,
        totalProviderTests: results.reduce((sum, r) => sum + r.providersTestedCount, 0),
        averageRanking: this.calculateAverageRanking(results),
        competitiveGaps: this.aggregateCompetitiveGaps(results),
        topOpportunities: this.identifyTopOpportunities(results),
        providerPerformance: this.analyzeProviderPerformance(results),
        results
      };

      return {
        ...aggregatedData,
        brandName,
        analysisTimestamp: new Date().toISOString(),
        success: true
      };

    } catch (error) {
      console.error('Error running competitive analysis:', error);
      return {
        brandName,
        error: error.message,
        success: false
      };
    }
  }

  // Helper methods for data analysis
  calculateAverageRanking(results) {
    const allRankings = results.flatMap(r => 
      r.results.filter(result => result.rank).map(result => result.rank)
    );
    
    if (allRankings.length === 0) return null;
    
    return (allRankings.reduce((sum, rank) => sum + rank, 0) / allRankings.length).toFixed(1);
  }

  aggregateCompetitiveGaps(results) {
    const gaps = results.flatMap(r => r.competitiveGaps || []);
    
    // Group by provider and find worst gaps
    const gapsByProvider = gaps.reduce((acc, gap) => {
      if (!acc[gap.provider]) {
        acc[gap.provider] = [];
      }
      acc[gap.provider].push(gap);
      return acc;
    }, {});

    return Object.entries(gapsByProvider).map(([provider, providerGaps]) => ({
      provider,
      gapCount: providerGaps.length,
      averageGapSize: (providerGaps.reduce((sum, g) => sum + g.gap_size, 0) / providerGaps.length).toFixed(1),
      worstGap: Math.max(...providerGaps.map(g => g.gap_size))
    }));
  }

  identifyTopOpportunities(results) {
    const allOpportunities = results.flatMap(r => r.opportunities || []);
    
    // Remove duplicates and return top opportunities
    const uniqueOpportunities = [...new Set(allOpportunities)];
    return uniqueOpportunities.slice(0, 5);
  }

  analyzeProviderPerformance(results) {
    const providerStats = {};
    
    results.forEach(result => {
      result.results.forEach(providerResult => {
        const provider = providerResult.provider;
        
        if (!providerStats[provider]) {
          providerStats[provider] = {
            totalTests: 0,
            averageRank: 0,
            averageSentiment: 0,
            averageConfidence: 0,
            totalRanks: [],
            totalSentiments: [],
            totalConfidences: []
          };
        }
        
        providerStats[provider].totalTests++;
        
        if (providerResult.rank) {
          providerStats[provider].totalRanks.push(providerResult.rank);
        }
        
        providerStats[provider].totalSentiments.push(providerResult.sentiment);
        providerStats[provider].totalConfidences.push(providerResult.confidence);
      });
    });

    // Calculate averages
    Object.values(providerStats).forEach(stats => {
      stats.averageRank = stats.totalRanks.length > 0 
        ? (stats.totalRanks.reduce((sum, rank) => sum + rank, 0) / stats.totalRanks.length).toFixed(1)
        : null;
      
      stats.averageSentiment = (stats.totalSentiments.reduce((sum, s) => sum + s, 0) / stats.totalSentiments.length).toFixed(1);
      stats.averageConfidence = (stats.totalConfidences.reduce((sum, c) => sum + c, 0) / stats.totalConfidences.length).toFixed(0);
      
      // Clean up arrays
      delete stats.totalRanks;
      delete stats.totalSentiments;
      delete stats.totalConfidences;
    });

    return providerStats;
  }
}

// Create singleton instance
export const realtimeApi = new RealtimeApiService();

// Export individual methods for convenience
export const {
  testPrompt,
  gradeContent,
  getRealtimeMentions,
  testConnection,
  runCompetitiveAnalysis
} = realtimeApi;

export default realtimeApi;