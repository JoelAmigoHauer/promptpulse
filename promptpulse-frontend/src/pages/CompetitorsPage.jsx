import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Search,
  Filter,
  Plus,
  Shield,
  Target,
  Crown,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  BarChart3,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import { CompetitorChallengeButton } from '../components/ChallengeCompetitorButton';

const CompetitorsPage = () => {
  const [competitorsData, setCompetitorsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByThreat, setFilterByThreat] = useState('all');
  const [filterByPosition, setFilterByPosition] = useState('all');
  const [sortBy, setSortBy] = useState('threat');
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', website: '', description: '' });

  useEffect(() => {
    fetchCompetitorsData();
  }, []);

  const fetchCompetitorsData = async () => {
    setLoading(true);
    try {
      // In production, this would call the API: /api/brands/competitors
      const response = await fetch('/api/brands/competitors');
      const data = await response.json();
      setCompetitorsData(data);
    } catch (error) {
      console.error('Error fetching competitors:', error);
      // Fallback to mock data
      setCompetitorsData(getMockCompetitorsData());
    }
    setLoading(false);
  };

  const getMockCompetitorsData = () => ({
    summary: {
      total_competitors: 12,
      actively_monitored: 8,
      competitive_gaps: 15,
      market_share_trend: "stable",
      high_threat_competitors: 3,
      opportunities_identified: 47
    },
    competitors: [
      {
        id: 1,
        name: "Ford",
        website: "https://ford.com",
        description: "Traditional automaker transitioning to electric vehicles with strong truck lineup",
        market_position: "strong",
        total_rankings: 156,
        avg_rank: 3.8,
        trend: "up",
        strength_areas: ["EV trucks", "dealership network", "manufacturing scale"],
        weakness_areas: ["charging infrastructure", "software integration"],
        threat_level: "high",
        opportunities_against: 23,
        monitoring_status: "active",
        last_analyzed: "2024-01-10T14:30:00Z",
        competitive_score: 78
      },
      {
        id: 2,
        name: "GM (General Motors)",
        website: "https://gm.com",
        description: "Legacy automaker with ambitious EV plans and Ultium platform",
        market_position: "moderate",
        total_rankings: 134,
        avg_rank: 4.1,
        trend: "stable",
        strength_areas: ["manufacturing scale", "OnStar technology", "Cadillac luxury"],
        weakness_areas: ["brand perception in EV space", "charging network"],
        threat_level: "medium",
        opportunities_against: 18,
        monitoring_status: "active",
        last_analyzed: "2024-01-10T13:45:00Z",
        competitive_score: 65
      },
      {
        id: 3,
        name: "Rivian",
        website: "https://rivian.com",
        description: "Electric truck startup focused on adventure and outdoor lifestyle",
        market_position: "emerging",
        total_rankings: 89,
        avg_rank: 5.2,
        trend: "down",
        strength_areas: ["truck innovation", "adventure focus", "Amazon partnership"],
        weakness_areas: ["production scale", "charging network", "cash flow"],
        threat_level: "low",
        opportunities_against: 31,
        monitoring_status: "active",
        last_analyzed: "2024-01-10T12:30:00Z",
        competitive_score: 52
      },
      {
        id: 4,
        name: "Lucid Motors",
        website: "https://lucidmotors.com",
        description: "Luxury EV manufacturer focusing on range and performance",
        market_position: "niche",
        total_rankings: 67,
        avg_rank: 6.1,
        trend: "stable",
        strength_areas: ["range technology", "luxury positioning", "performance"],
        weakness_areas: ["production volume", "market reach", "pricing"],
        threat_level: "low",
        opportunities_against: 28,
        monitoring_status: "active",
        last_analyzed: "2024-01-10T11:15:00Z",
        competitive_score: 45
      },
      {
        id: 5,
        name: "Mercedes-Benz",
        website: "https://mercedes-benz.com",
        description: "German luxury automaker with EQS and expanding EV lineup",
        market_position: "strong",
        total_rankings: 98,
        avg_rank: 4.5,
        trend: "up",
        strength_areas: ["luxury brand", "build quality", "global presence"],
        weakness_areas: ["EV software", "charging speed", "price positioning"],
        threat_level: "medium",
        opportunities_against: 19,
        monitoring_status: "paused",
        last_analyzed: "2024-01-09T16:20:00Z",
        competitive_score: 61
      }
    ],
    competitive_gaps: [
      {
        prompt: "EV truck towing capacity",
        leader: "Ford",
        leader_rank: 1,
        our_rank: 4,
        opportunity_score: 82,
        action: "Create comprehensive towing guide",
        gap_size: 3,
        difficulty: "medium",
        potential_impact: "high"
      },
      {
        prompt: "electric vehicle reliability",
        leader: "Consumer Reports",
        leader_rank: 1,
        our_rank: 6,
        opportunity_score: 75,
        action: "Develop reliability data content",
        gap_size: 5,
        difficulty: "high",
        potential_impact: "high"
      },
      {
        prompt: "luxury EV comparison",
        leader: "Mercedes-Benz",
        leader_rank: 2,
        our_rank: 5,
        opportunity_score: 68,
        action: "Enhance luxury positioning content",
        gap_size: 3,
        difficulty: "medium",
        potential_impact: "medium"
      },
      {
        prompt: "EV adventure capabilities",
        leader: "Rivian",
        leader_rank: 1,
        our_rank: 7,
        opportunity_score: 71,
        action: "Create adventure-focused content",
        gap_size: 6,
        difficulty: "low",
        potential_impact: "medium"
      }
    ]
  });

  const handleChallenge = (challengeData) => {
    console.log('Competitors challenge:', challengeData);
  };

  const addNewCompetitor = () => {
    if (!newCompetitor.name.trim()) return;
    
    const newCompetitorObj = {
      id: Date.now(),
      name: newCompetitor.name,
      website: newCompetitor.website,
      description: newCompetitor.description,
      market_position: "unknown",
      total_rankings: 0,
      avg_rank: null,
      trend: "new",
      strength_areas: [],
      weakness_areas: [],
      threat_level: "unknown",
      opportunities_against: 0,
      monitoring_status: "pending",
      last_analyzed: null,
      competitive_score: 0
    };
    
    setCompetitorsData(prev => ({
      ...prev,
      competitors: [newCompetitorObj, ...prev.competitors],
      summary: {
        ...prev.summary,
        total_competitors: prev.summary.total_competitors + 1
      }
    }));
    
    setNewCompetitor({ name: '', website: '', description: '' });
    setShowAddCompetitor(false);
  };

  const toggleMonitoring = (competitorId) => {
    setCompetitorsData(prev => ({
      ...prev,
      competitors: prev.competitors.map(competitor => 
        competitor.id === competitorId 
          ? { 
              ...competitor, 
              monitoring_status: competitor.monitoring_status === 'active' ? 'paused' : 'active' 
            }
          : competitor
      )
    }));
  };

  const getFilteredCompetitors = () => {
    if (!competitorsData) return [];
    
    let filtered = competitorsData.competitors;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(competitor => 
        competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competitor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competitor.strength_areas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by threat level
    if (filterByThreat !== 'all') {
      filtered = filtered.filter(competitor => competitor.threat_level === filterByThreat);
    }
    
    // Filter by market position
    if (filterByPosition !== 'all') {
      filtered = filtered.filter(competitor => competitor.market_position === filterByPosition);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'threat':
          const threatOrder = { 'high': 3, 'medium': 2, 'low': 1, 'unknown': 0 };
          return threatOrder[b.threat_level] - threatOrder[a.threat_level];
        case 'score':
          return b.competitive_score - a.competitive_score;
        case 'opportunities':
          return b.opportunities_against - a.opportunities_against;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (trend === 'new') return <Zap className="w-4 h-4 text-blue-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getThreatColor = (threat) => {
    switch (threat) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'strong': return 'text-red-600 bg-red-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'emerging': return 'text-blue-600 bg-blue-50';
      case 'niche': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGapSizeColor = (size) => {
    if (size >= 5) return 'text-red-600 bg-red-50';
    if (size >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading competitors data...</p>
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
                    <Users className="w-8 h-8 mr-3 text-blue-600" />
                    Competitive Intelligence
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Monitor competitors and identify strategic opportunities
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCompetitor(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Competitor</span>
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Competitors</p>
                    <p className="text-2xl font-bold text-gray-900">{competitorsData?.summary.total_competitors}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monitored</p>
                    <p className="text-2xl font-bold text-green-600">{competitorsData?.summary.actively_monitored}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Threat</p>
                    <p className="text-2xl font-bold text-red-600">{competitorsData?.summary.high_threat_competitors}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Competitive Gaps</p>
                    <p className="text-2xl font-bold text-gray-900">{competitorsData?.summary.competitive_gaps}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Opportunities</p>
                    <p className="text-2xl font-bold text-blue-600">{competitorsData?.summary.opportunities_identified}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Market Trend</p>
                    <p className="text-2xl font-bold text-gray-900 capitalize">{competitorsData?.summary.market_share_trend}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
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
                      placeholder="Search competitors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterByThreat}
                    onChange={(e) => setFilterByThreat(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Threat Levels</option>
                    <option value="high">High Threat</option>
                    <option value="medium">Medium Threat</option>
                    <option value="low">Low Threat</option>
                  </select>
                  
                  <select
                    value={filterByPosition}
                    onChange={(e) => setFilterByPosition(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Positions</option>
                    <option value="strong">Strong</option>
                    <option value="moderate">Moderate</option>
                    <option value="emerging">Emerging</option>
                    <option value="niche">Niche</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="threat">Threat Level</option>
                    <option value="score">Competitive Score</option>
                    <option value="opportunities">Opportunities</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getFilteredCompetitors().length} of {competitorsData?.competitors.length} competitors
                  </span>
                </div>
              </div>
            </div>

            {/* Add Competitor Modal */}
            {showAddCompetitor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Competitor</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newCompetitor.name}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                      placeholder="Competitor name..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      value={newCompetitor.website}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, website: e.target.value })}
                      placeholder="Website URL (optional)..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      value={newCompetitor.description}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, description: e.target.value })}
                      placeholder="Description (optional)..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowAddCompetitor(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addNewCompetitor}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Competitor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Competitors List */}
            <div className="space-y-6 mb-8">
              {getFilteredCompetitors().map((competitor) => (
                <div key={competitor.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{competitor.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getThreatColor(competitor.threat_level)}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {competitor.threat_level} threat
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(competitor.market_position)}`}>
                          {competitor.market_position}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          competitor.monitoring_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {competitor.monitoring_status === 'active' ? <Eye className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {competitor.monitoring_status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{competitor.description}</p>
                      {competitor.website && (
                        <a 
                          href={competitor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {competitor.website}
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMonitoring(competitor.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          competitor.monitoring_status === 'active' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={competitor.monitoring_status === 'active' ? 'Pause monitoring' : 'Resume monitoring'}
                      >
                        {competitor.monitoring_status === 'active' ? <Eye className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Score</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{competitor.competitive_score}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-600">Rankings</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{competitor.total_rankings}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-600">Avg Rank</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{competitor.avg_rank || '-'}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Opportunities</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{competitor.opportunities_against}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-600">Trend</span>
                      </div>
                      <div className="flex items-center justify-center">
                        {getTrendIcon(competitor.trend)}
                      </div>
                    </div>
                  </div>

                  {/* Strengths and Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                        Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {competitor.strength_areas.map((strength, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                        Weaknesses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {competitor.weakness_areas.map((weakness, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700"
                          >
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Challenge Button */}
                  <div className="flex justify-end">
                    <CompetitorChallengeButton
                      competitor={competitor.name}
                      onChallenge={handleChallenge}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Competitive Gaps Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Competitive Gap Analysis
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prompt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gap Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opportunity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recommended Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Challenge
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {competitorsData?.competitive_gaps.map((gap, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">"{gap.prompt}"</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{gap.leader}</div>
                          <div className="text-xs text-gray-500">Rank #{gap.leader_rank}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGapSizeColor(gap.gap_size)}`}>
                            {gap.gap_size} positions behind
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${gap.opportunity_score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{gap.opportunity_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{gap.action}</div>
                          <div className="text-xs text-gray-500">
                            {gap.difficulty} difficulty • {gap.potential_impact} impact
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CompetitorChallengeButton
                            competitor={gap.leader}
                            prompt={gap.prompt}
                            onChallenge={handleChallenge}
                            size="small"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorsPage;