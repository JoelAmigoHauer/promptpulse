import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Search,
  Filter,
  Crown,
  Link,
  Globe,
  Award,
  Eye,
  Calendar,
  Target,
  Plus,
  Copy,
  BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import { AuthorityChallengeButton } from '../components/ChallengeCompetitorButton';

const SourcesPage = () => {
  const [sourcesData, setSourcesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByTrend, setFilterByTrend] = useState('all');
  const [sortBy, setSortBy] = useState('citations');

  useEffect(() => {
    fetchSourcesData();
  }, []);

  const fetchSourcesData = async () => {
    setLoading(true);
    try {
      // In production, this would call the API: /api/brands/sources
      const response = await fetch('/api/brands/sources');
      const data = await response.json();
      setSourcesData(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
      // Fallback to mock data
      setSourcesData(getMockSourcesData());
    }
    setLoading(false);
  };

  const getMockSourcesData = () => ({
    summary: {
      total_citations: 234,
      unique_sources: 89,
      authority_score: 87,
      citation_growth: "+12%",
      top_citing_domains: ["reddit.com", "quora.com", "tesla.com"]
    },
    citations: [
      {
        url: "https://www.tesla.com/charging",
        title: "Tesla Supercharger Network",
        citations: 45,
        authority_score: 95,
        last_cited: "2024-01-10T14:20:00Z",
        citing_sources: ["ChatGPT", "Claude", "Gemini"],
        prompts: ["EV charging network", "Tesla supercharger locations"],
        trend: "up",
        domain: "tesla.com",
        content_type: "Product Page"
      },
      {
        url: "https://www.tesla.com/model3",
        title: "Tesla Model 3 Specifications",
        citations: 38,
        authority_score: 92,
        last_cited: "2024-01-10T13:15:00Z",
        citing_sources: ["ChatGPT", "Gemini"],
        prompts: ["Tesla Model 3 review", "electric vehicle specs"],
        trend: "stable",
        domain: "tesla.com",
        content_type: "Product Page"
      },
      {
        url: "https://www.irs.gov/credits-deductions/individuals/plug-in-electric-drive-vehicle-credit-section-30d",
        title: "Federal EV Tax Credit",
        citations: 29,
        authority_score: 98,
        last_cited: "2024-01-10T12:45:00Z",
        citing_sources: ["Claude", "ChatGPT"],
        prompts: ["EV tax incentives", "federal tax credit"],
        trend: "up",
        domain: "irs.gov",
        content_type: "Government"
      },
      {
        url: "https://www.consumerreports.org/cars/hybrids-evs/electric-vehicle-guide/",
        title: "Electric Vehicle Buying Guide",
        citations: 23,
        authority_score: 89,
        last_cited: "2024-01-10T11:30:00Z",
        citing_sources: ["ChatGPT", "Claude"],
        prompts: ["EV buying guide", "electric vehicle comparison"],
        trend: "up",
        domain: "consumerreports.org",
        content_type: "Editorial"
      },
      {
        url: "https://www.edmunds.com/electric-car/",
        title: "Electric Cars - Edmunds",
        citations: 19,
        authority_score: 85,
        last_cited: "2024-01-10T10:15:00Z",
        citing_sources: ["Gemini", "ChatGPT"],
        prompts: ["electric car prices", "EV reviews"],
        trend: "stable",
        domain: "edmunds.com",
        content_type: "Editorial"
      },
      {
        url: "https://www.caranddriver.com/features/a15079828/plug-in-hybrid-vs-electric-car/",
        title: "Plug-in Hybrid vs Electric Car",
        citations: 15,
        authority_score: 82,
        last_cited: "2024-01-10T09:45:00Z",
        citing_sources: ["Claude"],
        prompts: ["hybrid vs electric", "PHEV comparison"],
        trend: "down",
        domain: "caranddriver.com",
        content_type: "Editorial"
      }
    ],
    authority_building: [
      {
        opportunity: "Create comprehensive EV buying guide",
        potential_citations: 25,
        authority_impact: "high",
        effort: "medium",
        timeline: "2-3 weeks"
      },
      {
        opportunity: "Develop charging cost calculator",
        potential_citations: 18,
        authority_impact: "medium",
        effort: "low",
        timeline: "1 week"
      },
      {
        opportunity: "EV maintenance cost analysis",
        potential_citations: 22,
        authority_impact: "high",
        effort: "medium",
        timeline: "2 weeks"
      }
    ]
  });

  const handleChallenge = (challengeData) => {
    console.log('Sources challenge:', challengeData);
  };

  const getFilteredSources = () => {
    if (!sourcesData) return [];
    
    let filtered = sourcesData.citations;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(source => 
        source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.prompts.some(prompt => prompt.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by trend
    if (filterByTrend !== 'all') {
      filtered = filtered.filter(source => source.trend === filterByTrend);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'citations':
          return b.citations - a.citations;
        case 'authority':
          return b.authority_score - a.authority_score;
        case 'recent':
          return new Date(b.last_cited) - new Date(a.last_cited);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sources data...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Link className="w-8 h-8 mr-3 text-blue-600" />
                Source Citations
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Track URL citations and build your authority across AI platforms
              </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Citations</p>
                    <p className="text-2xl font-bold text-gray-900">{sourcesData?.summary.total_citations}</p>
                  </div>
                  <Link className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unique Sources</p>
                    <p className="text-2xl font-bold text-gray-900">{sourcesData?.summary.unique_sources}</p>
                  </div>
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Authority Score</p>
                    <p className="text-2xl font-bold text-gray-900">{sourcesData?.summary.authority_score}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Citation Growth</p>
                    <p className="text-2xl font-bold text-green-600">{sourcesData?.summary.citation_growth}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Top Citing Domains */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Citing Domains</h3>
              <div className="flex flex-wrap gap-3">
                {sourcesData?.summary.top_citing_domains.map((domain, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterByTrend}
                    onChange={(e) => setFilterByTrend(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Trends</option>
                    <option value="up">Trending Up</option>
                    <option value="stable">Stable</option>
                    <option value="down">Trending Down</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="citations">Most Citations</option>
                    <option value="authority">Highest Authority</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getFilteredSources().length} of {sourcesData?.citations.length} sources
                  </span>
                </div>
              </div>
            </div>

            {/* Sources List */}
            <div className="space-y-6 mb-8">
              {getFilteredSources().map((source, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{source.title}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(source.trend)}`}>
                              {getTrendIcon(source.trend)}
                              <span className="ml-1 capitalize">{source.trend}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {source.domain}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {source.content_type}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(source.last_cited)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyUrl(source.url)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Open URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            <Link className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Citations</p>
                            <p className="text-lg font-bold text-gray-900">{source.citations}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                            <Award className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Authority Score</p>
                            <p className="text-lg font-bold text-gray-900">{source.authority_score}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">AI Sources</p>
                            <p className="text-lg font-bold text-gray-900">{source.citing_sources.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Sources */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium text-gray-600">Cited by:</span>
                        <div className="flex space-x-2">
                          {source.citing_sources.map((aiSource, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {aiSource}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Related Prompts */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium text-gray-600">Related prompts:</span>
                        <div className="flex flex-wrap gap-2">
                          {source.prompts.map((prompt, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {prompt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Challenge Button */}
                      <div className="flex justify-end">
                        <AuthorityChallengeButton
                          competitor={source.domain}
                          prompt={source.prompts[0]}
                          onChallenge={handleChallenge}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Authority Building Opportunities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Authority Building Opportunities</h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sourcesData?.authority_building.map((opportunity, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{opportunity.opportunity}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        opportunity.authority_impact === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {opportunity.authority_impact} impact
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Potential Citations:</span>
                        <span className="font-medium">{opportunity.potential_citations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Effort Level:</span>
                        <span className="font-medium capitalize">{opportunity.effort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-medium">{opportunity.timeline}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Create Content</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;