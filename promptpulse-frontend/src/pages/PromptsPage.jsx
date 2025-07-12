import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  BarChart3,
  Target,
  Zap,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Users,
  Crown,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import { RankingChallengeButton } from '../components/ChallengeCompetitorButton';
import PromptDetailModal from '../components/PromptDetailModal';

const PromptsPage = () => {
  const [promptsData, setPromptsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('all');
  const [filterByOpportunity, setFilterByOpportunity] = useState('all');
  const [sortBy, setSortBy] = useState('performance');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    fetchPromptsData();
  }, []);

  const fetchPromptsData = async () => {
    setLoading(true);
    try {
      // In production, this would call the API: /api/brands/prompts
      const response = await fetch('/api/brands/prompts');
      const data = await response.json();
      setPromptsData(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      // Fallback to mock data
      setPromptsData(getMockPromptsData());
    }
    setLoading(false);
  };

  const getMockPromptsData = () => ({
    summary: {
      total_prompts: 247,
      active_prompts: 189,
      monitored_keywords: 156,
      avg_performance: 73.5,
      trending_prompts: 12
    },
    prompts: [
      {
        id: 1,
        prompt: "electric vehicle financing options",
        status: "active",
        current_rank: 2,
        previous_rank: 4,
        search_volume: 15400,
        difficulty: 65,
        performance_score: 89,
        last_updated: "2024-01-10T14:00:00Z",
        ai_sources: {
          chatgpt: { rank: 2, frequency: 78 },
          claude: { rank: 1, frequency: 85 },
          gemini: { rank: 3, frequency: 62 }
        },
        trend: "up",
        opportunity: "high",
        cluster: "EV Financing"
      },
      {
        id: 2,
        prompt: "Tesla charging network coverage",
        status: "active",
        current_rank: 1,
        previous_rank: 1,
        search_volume: 22100,
        difficulty: 78,
        performance_score: 95,
        last_updated: "2024-01-10T13:30:00Z",
        ai_sources: {
          chatgpt: { rank: 1, frequency: 92 },
          claude: { rank: 1, frequency: 89 },
          gemini: { rank: 2, frequency: 76 }
        },
        trend: "stable",
        opportunity: "maintain",
        cluster: "Charging Infrastructure"
      },
      {
        id: 3,
        prompt: "electric vehicle tax incentives 2024",
        status: "active",
        current_rank: 3,
        previous_rank: 5,
        search_volume: 12300,
        difficulty: 45,
        performance_score: 82,
        last_updated: "2024-01-10T12:15:00Z",
        ai_sources: {
          chatgpt: { rank: 3, frequency: 71 },
          claude: { rank: 2, frequency: 79 },
          gemini: { rank: 4, frequency: 58 }
        },
        trend: "up",
        opportunity: "high",
        cluster: "EV Financing"
      },
      {
        id: 4,
        prompt: "Tesla autopilot safety record",
        status: "paused",
        current_rank: 5,
        previous_rank: 4,
        search_volume: 8900,
        difficulty: 72,
        performance_score: 68,
        last_updated: "2024-01-09T16:45:00Z",
        ai_sources: {
          chatgpt: { rank: 5, frequency: 45 },
          claude: { rank: 6, frequency: 52 },
          gemini: { rank: 4, frequency: 61 }
        },
        trend: "down",
        opportunity: "medium",
        cluster: "Safety & Technology"
      },
      {
        id: 5,
        prompt: "EV maintenance costs comparison",
        status: "active",
        current_rank: 6,
        previous_rank: 7,
        search_volume: 7200,
        difficulty: 35,
        performance_score: 75,
        last_updated: "2024-01-10T11:20:00Z",
        ai_sources: {
          chatgpt: { rank: 6, frequency: 67 },
          claude: { rank: 5, frequency: 72 },
          gemini: { rank: 7, frequency: 54 }
        },
        trend: "up",
        opportunity: "high",
        cluster: "Cost & Value"
      }
    ],
    keyword_clusters: [
      {
        cluster: "EV Financing",
        prompts: 23,
        avg_rank: 3.2,
        total_volume: 145600,
        opportunity_score: 78
      },
      {
        cluster: "Charging Infrastructure", 
        prompts: 34,
        avg_rank: 2.8,
        total_volume: 234500,
        opportunity_score: 85
      },
      {
        cluster: "Safety & Technology",
        prompts: 19,
        avg_rank: 4.1,
        total_volume: 98200,
        opportunity_score: 65
      },
      {
        cluster: "Cost & Value",
        prompts: 28,
        avg_rank: 3.7,
        total_volume: 167300,
        opportunity_score: 72
      }
    ]
  });

  const handleChallenge = (challengeData) => {
    console.log('Prompts challenge:', challengeData);
  };

  const handleViewDetails = (prompt) => {
    setSelectedPrompt(prompt);
    setShowDetailModal(true);
  };

  const togglePromptStatus = (promptId) => {
    setPromptsData(prev => ({
      ...prev,
      prompts: prev.prompts.map(prompt => 
        prompt.id === promptId 
          ? { ...prompt, status: prompt.status === 'active' ? 'paused' : 'active' }
          : prompt
      )
    }));
  };

  const addNewPrompt = () => {
    if (!newPrompt.trim()) return;
    
    const newPromptObj = {
      id: Date.now(),
      prompt: newPrompt,
      status: "active",
      current_rank: null,
      previous_rank: null,
      search_volume: null,
      difficulty: null,
      performance_score: null,
      last_updated: new Date().toISOString(),
      ai_sources: {
        chatgpt: { rank: null, frequency: 0 },
        claude: { rank: null, frequency: 0 },
        gemini: { rank: null, frequency: 0 }
      },
      trend: "new",
      opportunity: "pending",
      cluster: "Unassigned"
    };
    
    setPromptsData(prev => ({
      ...prev,
      prompts: [newPromptObj, ...prev.prompts],
      summary: {
        ...prev.summary,
        total_prompts: prev.summary.total_prompts + 1,
        active_prompts: prev.summary.active_prompts + 1
      }
    }));
    
    setNewPrompt('');
    setShowAddPrompt(false);
  };

  const getFilteredPrompts = () => {
    if (!promptsData) return [];
    
    let filtered = promptsData.prompts;
    
    // Filter by cluster if selected
    if (selectedCluster) {
      filtered = filtered.filter(prompt => prompt.cluster === selectedCluster);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(prompt => 
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterByStatus !== 'all') {
      filtered = filtered.filter(prompt => prompt.status === filterByStatus);
    }
    
    // Filter by opportunity
    if (filterByOpportunity !== 'all') {
      filtered = filtered.filter(prompt => prompt.opportunity === filterByOpportunity);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          return (b.performance_score || 0) - (a.performance_score || 0);
        case 'rank':
          return (a.current_rank || 999) - (b.current_rank || 999);
        case 'volume':
          return (b.search_volume || 0) - (a.search_volume || 0);
        case 'recent':
          return new Date(b.last_updated) - new Date(a.last_updated);
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

  const getRankColor = (rank) => {
    if (!rank) return 'text-gray-400 bg-gray-50';
    if (rank === 1) return 'text-green-600 bg-green-50';
    if (rank <= 3) return 'text-blue-600 bg-blue-50';
    if (rank <= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getOpportunityColor = (opportunity) => {
    switch (opportunity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'maintain': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prompts data...</p>
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
                    <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
                    Prompts Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Monitor and optimize your AI search prompt performance
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPrompt(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Prompt</span>
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                    <p className="text-2xl font-bold text-gray-900">{promptsData?.summary.total_prompts}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{promptsData?.summary.active_prompts}</p>
                  </div>
                  <Play className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Keywords</p>
                    <p className="text-2xl font-bold text-gray-900">{promptsData?.summary.monitored_keywords}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{promptsData?.summary.avg_performance}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trending</p>
                    <p className="text-2xl font-bold text-green-600">{promptsData?.summary.trending_prompts}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Keyword Clusters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Clusters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {promptsData?.keyword_clusters.map((cluster, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCluster(selectedCluster === cluster.cluster ? null : cluster.cluster)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCluster === cluster.cluster
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{cluster.cluster}</h4>
                      <span className="text-xs text-gray-500">{cluster.prompts} prompts</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Avg Rank:</span>
                        <span className="font-medium ml-1">{cluster.avg_rank}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <span className="font-medium ml-1">{(cluster.total_volume / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Opportunity</span>
                        <span>{cluster.opportunity_score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cluster.opportunity_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedCluster && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Showing prompts from <strong>{selectedCluster}</strong> cluster. 
                    <button 
                      onClick={() => setSelectedCluster(null)}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear filter
                    </button>
                  </p>
                </div>
              )}
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterByStatus}
                    onChange={(e) => setFilterByStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                  
                  <select
                    value={filterByOpportunity}
                    onChange={(e) => setFilterByOpportunity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Opportunities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="maintain">Maintain</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="performance">Best Performance</option>
                    <option value="rank">Best Rank</option>
                    <option value="volume">Highest Volume</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getFilteredPrompts().length} of {promptsData?.prompts.length} prompts
                  </span>
                </div>
              </div>
            </div>

            {/* Add Prompt Modal */}
            {showAddPrompt && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Prompt</h3>
                  <input
                    type="text"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Enter prompt to monitor..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    onKeyPress={(e) => e.key === 'Enter' && addNewPrompt()}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddPrompt(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addNewPrompt}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Prompt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Prompts List */}
            <div className="space-y-4">
              {getFilteredPrompts().map((prompt) => (
                <div key={prompt.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{prompt.prompt}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            prompt.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {prompt.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOpportunityColor(prompt.opportunity)}`}>
                            {prompt.opportunity}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePromptStatus(prompt.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              prompt.status === 'active' 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                            title={prompt.status === 'active' ? 'Pause monitoring' : 'Resume monitoring'}
                          >
                            {prompt.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-gray-600">Rank</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            {prompt.current_rank && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRankColor(prompt.current_rank)}`}>
                                #{prompt.current_rank}
                              </span>
                            )}
                            {prompt.previous_rank && prompt.current_rank && (
                              <div className="flex items-center">
                                {getTrendIcon(prompt.trend)}
                              </div>
                            )}
                            {!prompt.current_rank && (
                              <span className="text-gray-400 text-sm">Pending</span>
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Performance</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {prompt.performance_score || '-'}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Search className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Volume</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {prompt.search_volume ? (prompt.search_volume / 1000).toFixed(1) + 'k' : '-'}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Target className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-600">Difficulty</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {prompt.difficulty || '-'}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-600">Updated</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            {formatDate(prompt.last_updated)}
                          </div>
                        </div>
                      </div>

                      {/* AI Sources Performance */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {Object.entries(prompt.ai_sources).map(([source, data]) => (
                          <div key={source} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                              {data.rank && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(data.rank)}`}>
                                  #{data.rank}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              Frequency: {data.frequency}%
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Cluster:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            {prompt.cluster}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {prompt.current_rank > 1 && (
                            <RankingChallengeButton
                              competitor="Top Competitor"
                              prompt={prompt.prompt}
                              ranking={prompt.current_rank}
                              onChallenge={handleChallenge}
                            />
                          )}
                          <button 
                            onClick={() => handleViewDetails(prompt)}
                            className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredPrompts().length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterByStatus !== 'all' || filterByOpportunity !== 'all' || selectedCluster
                    ? 'Try adjusting your filters or search query.'
                    : 'Get started by adding your first prompt to monitor.'}
                </p>
                {!searchQuery && filterByStatus === 'all' && filterByOpportunity === 'all' && !selectedCluster && (
                  <button
                    onClick={() => setShowAddPrompt(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Prompt
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        prompt={selectedPrompt?.prompt}
        promptData={selectedPrompt}
      />
    </div>
  );
};

export default PromptsPage;