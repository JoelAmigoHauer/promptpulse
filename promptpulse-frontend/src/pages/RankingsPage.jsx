import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Crown, 
  Target, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import { RankingChallengeButton } from '../components/ChallengeCompetitorButton';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

const RankingsPage = () => {
  const [rankingsData, setRankingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [filterByDifficulty, setFilterByDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRankingsData();
  }, [selectedTimeframe]);

  const fetchRankingsData = async () => {
    setLoading(true);
    try {
      // In production, this would call the API: /api/brands/rankings
      const response = await fetch(`/api/brands/rankings?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      setRankingsData(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      // Fallback to mock data
      setRankingsData(getMockRankingsData());
    }
    setLoading(false);
  };

  const getMockRankingsData = () => ({
    overview: {
      total_prompts: 247,
      top_3_rankings: 34,
      average_rank: 4.2,
      rank_improvement: "+2.3",
      trending: "up"
    },
    bubble_chart: [
      {
        prompt: "electric vehicle financing",
        rank: 2,
        search_volume: 15400,
        difficulty: 65,
        opportunity_score: 89,
        brand: "Tesla",
        competitors: ["Ford", "GM", "Rivian"]
      },
      {
        prompt: "EV charging network",
        rank: 1,
        search_volume: 22100,
        difficulty: 78,
        opportunity_score: 95,
        brand: "Tesla",
        competitors: ["ChargePoint", "Electrify America"]
      },
      {
        prompt: "electric vehicle tax incentives",
        rank: 4,
        search_volume: 12300,
        difficulty: 45,
        opportunity_score: 72,
        brand: "Tesla",
        competitors: ["IRS", "Ford", "Chevy"]
      },
      {
        prompt: "Tesla Model 3 review",
        rank: 3,
        search_volume: 8900,
        difficulty: 82,
        opportunity_score: 68,
        brand: "Tesla",
        competitors: ["Car and Driver", "Motor Trend", "Ford"]
      },
      {
        prompt: "EV maintenance costs",
        rank: 6,
        search_volume: 7200,
        difficulty: 35,
        opportunity_score: 85,
        brand: "Tesla",
        competitors: ["AAA", "Consumer Reports"]
      },
      {
        prompt: "electric vehicle range comparison",
        rank: 5,
        search_volume: 9800,
        difficulty: 55,
        opportunity_score: 78,
        brand: "Tesla",
        competitors: ["Lucid", "Mercedes", "BMW"]
      },
      {
        prompt: "Tesla autopilot safety",
        rank: 2,
        search_volume: 11200,
        difficulty: 70,
        opportunity_score: 82,
        brand: "Tesla",
        competitors: ["Waymo", "GM Cruise"]
      }
    ],
    competitor_analysis: {
      "Ford": { total_rankings: 156, avg_rank: 3.8, trend: "up" },
      "GM": { total_rankings: 134, avg_rank: 4.1, trend: "stable" },
      "Rivian": { total_rankings: 89, avg_rank: 5.2, trend: "down" }
    },
    rank_changes: [
      {
        prompt: "electric vehicle charging",
        previous_rank: 4,
        current_rank: 2,
        change: "+2",
        date: "2024-01-10"
      },
      {
        prompt: "EV tax credits",
        previous_rank: 6,
        current_rank: 3,
        change: "+3",
        date: "2024-01-09"
      }
    ]
  });

  const handleChallenge = (challengeData) => {
    console.log('Rankings challenge:', challengeData);
  };

  const getFilteredData = () => {
    if (!rankingsData) return [];
    
    let filtered = rankingsData.bubble_chart;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by difficulty
    if (filterByDifficulty !== 'all') {
      const difficultyRanges = {
        'low': [0, 40],
        'medium': [41, 70],
        'high': [71, 100]
      };
      const [min, max] = difficultyRanges[filterByDifficulty];
      filtered = filtered.filter(item => 
        item.difficulty >= min && item.difficulty <= max
      );
    }
    
    return filtered;
  };

  const getBubbleChartData = () => {
    const filteredData = getFilteredData();
    
    return {
      datasets: [
        {
          label: 'Content Opportunities',
          data: filteredData.map(item => ({
            x: item.difficulty,
            y: item.opportunity_score,
            r: Math.sqrt(item.search_volume) / 10, // Bubble size based on search volume
            prompt: item.prompt,
            rank: item.rank,
            search_volume: item.search_volume,
            competitors: item.competitors
          })),
          backgroundColor: (ctx) => {
            const rank = ctx.parsed?.rank || 10;
            if (rank === 1) return 'rgba(34, 197, 94, 0.7)'; // Green for #1
            if (rank <= 3) return 'rgba(59, 130, 246, 0.7)'; // Blue for top 3
            if (rank <= 5) return 'rgba(251, 191, 36, 0.7)'; // Yellow for top 5
            return 'rgba(239, 68, 68, 0.7)'; // Red for lower ranks
          },
          borderColor: (ctx) => {
            const rank = ctx.parsed?.rank || 10;
            if (rank === 1) return 'rgb(34, 197, 94)';
            if (rank <= 3) return 'rgb(59, 130, 246)';
            if (rank <= 5) return 'rgb(251, 191, 36)';
            return 'rgb(239, 68, 68)';
          },
          borderWidth: 2
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Competitive Landscape: Opportunity vs. Difficulty',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].raw.prompt,
          label: (context) => [
            `Rank: #${context.raw.rank}`,
            `Opportunity Score: ${context.raw.y}`,
            `Difficulty: ${context.raw.x}`,
            `Search Volume: ${context.raw.search_volume?.toLocaleString()}`,
            `Competitors: ${context.raw.competitors?.join(', ')}`
          ]
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Difficulty Score'
        },
        min: 0,
        max: 100
      },
      y: {
        title: {
          display: true,
          text: 'Opportunity Score'
        },
        min: 0,
        max: 100
      }
    }
  };

  const getRankTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-green-600 bg-green-50';
    if (rank <= 3) return 'text-blue-600 bg-blue-50';
    if (rank <= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rankings data...</p>
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
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Competitive Rankings
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Analyze your competitive landscape and identify content opportunities
              </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                    <p className="text-2xl font-bold text-gray-900">{rankingsData?.overview.total_prompts}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top 3 Rankings</p>
                    <p className="text-2xl font-bold text-gray-900">{rankingsData?.overview.top_3_rankings}</p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rank</p>
                    <p className="text-2xl font-bold text-gray-900">{rankingsData?.overview.average_rank}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rank Improvement</p>
                    <p className="text-2xl font-bold text-green-600">{rankingsData?.overview.rank_improvement}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
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
                      placeholder="Search prompts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterByDifficulty}
                    onChange={(e) => setFilterByDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="low">Low (0-40)</option>
                    <option value="medium">Medium (41-70)</option>
                    <option value="high">High (71-100)</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getFilteredData().length} of {rankingsData?.bubble_chart.length} prompts
                  </span>
                </div>
              </div>
            </div>

            {/* Bubble Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="h-96">
                <Scatter data={getBubbleChartData()} options={chartOptions} />
              </div>
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>#1 Ranking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Top 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Top 5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Below Top 5</span>
                </div>
              </div>
            </div>

            {/* Rankings Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Rankings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prompt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Search Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opportunity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Competitors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredData().map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.prompt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(item.rank)}`}>
                            #{item.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.search_volume?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${item.difficulty}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{item.difficulty}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${item.opportunity_score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{item.opportunity_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex -space-x-1">
                            {item.competitors.slice(0, 3).map((competitor, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border-2 border-white"
                                title={competitor}
                              >
                                {competitor.charAt(0)}
                              </span>
                            ))}
                            {item.competitors.length > 3 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium text-gray-600 border-2 border-white">
                                +{item.competitors.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RankingChallengeButton
                            competitor={item.competitors[0]}
                            prompt={item.prompt}
                            ranking={item.rank}
                            onChallenge={handleChallenge}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Rank Changes */}
            {rankingsData?.rank_changes && rankingsData.rank_changes.length > 0 && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Rank Changes</h3>
                <div className="space-y-3">
                  {rankingsData.rank_changes.map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getRankTrendIcon(parseInt(change.change))}
                        <div>
                          <p className="font-medium text-gray-900">{change.prompt}</p>
                          <p className="text-sm text-gray-500">
                            #{change.previous_rank} → #{change.current_rank} ({change.change})
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{change.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;