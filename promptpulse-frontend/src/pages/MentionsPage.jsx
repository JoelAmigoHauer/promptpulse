import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Frown,
  Meh,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Zap,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Eye,
  Play,
  Pause
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import { MentionChallengeButton } from '../components/ChallengeCompetitorButton';

const MentionsPage = () => {
  const [mentionsData, setMentionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySentiment, setFilterBySentiment] = useState('all');
  const [filterBySource, setFilterBySource] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showRealTimeFeed, setShowRealTimeFeed] = useState(true);

  useEffect(() => {
    fetchMentionsData();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchMentionsData();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchMentionsData = async () => {
    setLoading(true);
    try {
      // In production, this would call the API: /api/brands/mentions
      const response = await fetch('/api/brands/mentions');
      const data = await response.json();
      setMentionsData(data);
    } catch (error) {
      console.error('Error fetching mentions:', error);
      // Fallback to mock data
      setMentionsData(getMockMentionsData());
    }
    setLoading(false);
  };

  const getMockMentionsData = () => ({
    summary: {
      total_mentions: 156,
      positive_sentiment: 78,
      neutral_sentiment: 15,
      negative_sentiment: 7,
      sentiment_score: 4.2,
      trending_topics: ["EV charging", "sustainability", "innovation"],
      mentions_today: 23,
      growth_24h: "+18%"
    },
    mentions: [
      {
        id: 1,
        content: "Tesla's supercharger network is the most reliable for long-distance EV travel. The charging speed and station availability make it the clear leader in the space.",
        source: "ChatGPT",
        prompt: "best EV charging network",
        sentiment: "positive",
        sentiment_score: 4.8,
        timestamp: "2024-01-10T14:30:00Z",
        context: "comparison query",
        competitors_mentioned: ["ChargePoint", "Electrify America"],
        keywords_found: ["supercharger", "reliable", "charging speed"],
        url_references: ["https://tesla.com/charging"],
        confidence: 92
      },
      {
        id: 2,
        content: "Tesla Model 3 offers excellent value with federal tax incentives. When considering the total cost of ownership, it becomes very competitive with traditional vehicles.",
        source: "Claude",
        prompt: "electric vehicle tax incentives 2024",
        sentiment: "positive",
        sentiment_score: 4.5,
        timestamp: "2024-01-10T13:45:00Z",
        context: "informational query",
        competitors_mentioned: ["Ford", "Chevy"],
        keywords_found: ["Model 3", "tax incentives", "value"],
        url_references: ["https://tesla.com/model3"],
        confidence: 89
      },
      {
        id: 3,
        content: "Tesla's autopilot safety record shows continuous improvement. Recent data indicates fewer accidents per mile compared to human drivers.",
        source: "Gemini",
        prompt: "Tesla autopilot safety statistics",
        sentiment: "positive",
        sentiment_score: 4.3,
        timestamp: "2024-01-10T12:15:00Z",
        context: "safety inquiry",
        competitors_mentioned: ["Waymo", "GM Cruise"],
        keywords_found: ["autopilot", "safety", "statistics"],
        url_references: [],
        confidence: 85
      },
      {
        id: 4,
        content: "Tesla vehicles may have higher upfront costs, but maintenance expenses are generally lower than traditional vehicles due to fewer moving parts.",
        source: "ChatGPT",
        prompt: "Tesla maintenance costs",
        sentiment: "neutral",
        sentiment_score: 3.2,
        timestamp: "2024-01-10T11:30:00Z",
        context: "cost analysis",
        competitors_mentioned: ["Toyota", "Honda"],
        keywords_found: ["maintenance", "costs", "upfront"],
        url_references: [],
        confidence: 78
      },
      {
        id: 5,
        content: "Some Tesla owners report concerns about build quality and service wait times, though recent improvements have been noted.",
        source: "Claude",
        prompt: "Tesla quality issues",
        sentiment: "negative",
        sentiment_score: 2.1,
        timestamp: "2024-01-10T10:45:00Z",
        context: "quality inquiry",
        competitors_mentioned: ["Mercedes", "BMW"],
        keywords_found: ["build quality", "service", "wait times"],
        url_references: [],
        confidence: 82
      }
    ],
    real_time_feed: [
      {
        time: "14:35",
        source: "ChatGPT",
        mention_type: "positive",
        snippet: "Tesla leads in charging infrastructure...",
        prompt: "EV charging network comparison"
      },
      {
        time: "14:32",
        source: "Claude",
        mention_type: "neutral",
        snippet: "Tesla Model Y pricing compared to...",
        prompt: "electric SUV comparison"
      },
      {
        time: "14:28",
        source: "Gemini",
        mention_type: "positive",
        snippet: "Tesla's software updates provide...",
        prompt: "OTA updates electric vehicles"
      },
      {
        time: "14:25",
        source: "ChatGPT",
        mention_type: "positive",
        snippet: "Supercharger network reliability...",
        prompt: "Tesla charging reliability"
      },
      {
        time: "14:22",
        source: "Claude",
        mention_type: "neutral",
        snippet: "Tesla autopilot vs traditional...",
        prompt: "autopilot safety comparison"
      }
    ]
  });

  const handleChallenge = (challengeData) => {
    console.log('Mentions challenge:', challengeData);
  };

  const getFilteredMentions = () => {
    if (!mentionsData) return [];
    
    let filtered = mentionsData.mentions;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(mention => 
        mention.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mention.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mention.keywords_found.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by sentiment
    if (filterBySentiment !== 'all') {
      filtered = filtered.filter(mention => mention.sentiment === filterBySentiment);
    }
    
    // Filter by source
    if (filterBySource !== 'all') {
      filtered = filtered.filter(mention => mention.source === filterBySource);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'sentiment':
          return b.sentiment_score - a.sentiment_score;
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getSentimentIcon = (sentiment, score) => {
    if (sentiment === 'positive' || score >= 4) return <Heart className="w-4 h-4 text-green-600" />;
    if (sentiment === 'negative' || score <= 2) return <Frown className="w-4 h-4 text-red-600" />;
    return <Meh className="w-4 h-4 text-yellow-600" />;
  };

  const getSentimentColor = (sentiment, score) => {
    if (sentiment === 'positive' || score >= 4) return 'text-green-600 bg-green-50';
    if (sentiment === 'negative' || score <= 2) return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getRealTimeFeedTypeColor = (type) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mentions data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        <Filters />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MessageCircle className="w-8 h-8 mr-3 text-blue-600" />
                    Brand Mentions
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Monitor real-time brand mentions across AI platforms
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      autoRefresh 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{autoRefresh ? 'Pause' : 'Resume'} Auto-refresh</span>
                  </button>
                  <button
                    onClick={fetchMentionsData}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Mentions</p>
                    <p className="text-2xl font-bold text-gray-900">{mentionsData?.summary.total_mentions}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Positive</p>
                    <p className="text-2xl font-bold text-green-600">{mentionsData?.summary.positive_sentiment}</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sentiment Score</p>
                    <p className="text-2xl font-bold text-gray-900">{mentionsData?.summary.sentiment_score}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-gray-900">{mentionsData?.summary.mentions_today}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">24h Growth</p>
                    <p className="text-2xl font-bold text-green-600">{mentionsData?.summary.growth_24h}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Mentions Feed */}
              <div className="lg:col-span-2">
                {/* Filters and Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search mentions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <select
                        value={filterBySentiment}
                        onChange={(e) => setFilterBySentiment(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                      </select>
                      
                      <select
                        value={filterBySource}
                        onChange={(e) => setFilterBySource(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Sources</option>
                        <option value="ChatGPT">ChatGPT</option>
                        <option value="Claude">Claude</option>
                        <option value="Gemini">Gemini</option>
                      </select>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="sentiment">Best Sentiment</option>
                        <option value="confidence">Highest Confidence</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {getFilteredMentions().length} of {mentionsData?.mentions.length} mentions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentions List */}
                <div className="space-y-6">
                  {getFilteredMentions().map((mention) => (
                    <div key={mention.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(mention.sentiment, mention.sentiment_score)}`}>
                            {getSentimentIcon(mention.sentiment, mention.sentiment_score)}
                            <span className="capitalize">{mention.sentiment}</span>
                            <span>({mention.sentiment_score})</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {mention.source}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(mention.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Confidence: {mention.confidence}%</span>
                          {mention.url_references.length > 0 && (
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <p className="text-gray-900 leading-relaxed mb-3">{mention.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Search className="w-4 h-4 mr-1" />
                            Prompt: "{mention.prompt}"
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            Context: {mention.context}
                          </span>
                        </div>
                      </div>

                      {/* Keywords and Competitors */}
                      <div className="mb-4">
                        {mention.keywords_found.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-600 mr-2">Keywords:</span>
                            <div className="inline-flex flex-wrap gap-2">
                              {mention.keywords_found.map((keyword, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {mention.competitors_mentioned.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 mr-2">Competitors mentioned:</span>
                            <div className="inline-flex flex-wrap gap-2">
                              {mention.competitors_mentioned.map((competitor, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700"
                                >
                                  {competitor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Challenge Button */}
                      <div className="flex justify-end">
                        <MentionChallengeButton
                          competitor={mention.competitors_mentioned[0] || "Competitor"}
                          prompt={mention.prompt}
                          onChallenge={handleChallenge}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredMentions().length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No mentions found</h3>
                    <p className="text-gray-600">
                      {searchQuery || filterBySentiment !== 'all' || filterBySource !== 'all'
                        ? 'Try adjusting your filters or search query.'
                        : 'No brand mentions available at the moment.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Real-time Feed Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    Trending Topics
                  </h3>
                  <div className="space-y-2">
                    {mentionsData?.summary.trending_topics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{topic}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Feed */}
                {showRealTimeFeed && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Live Feed
                      </h3>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {mentionsData?.real_time_feed.map((item, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getRealTimeFeedTypeColor(item.mention_type)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">{item.source}</span>
                            <span className="text-xs text-gray-500">{item.time}</span>
                          </div>
                          <p className="text-sm text-gray-800 mb-2">{item.snippet}</p>
                          <p className="text-xs text-gray-600">"{item.prompt}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionsPage;