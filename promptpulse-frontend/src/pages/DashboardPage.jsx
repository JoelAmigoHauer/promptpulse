import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import Filters from '../components/Filters';
import ActionHub from '../components/ActionHub';
import { RankingChallengeButton, MentionChallengeButton } from '../components/ChallengeCompetitorButton';

const DashboardPage = ({ onLogout }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  const handleChallenge = (challengeData) => {
    console.log('Challenge created:', challengeData);
    // In production, this would trigger the content creation workflow
  };

  // Mock data for Brand Visibility Score trend
  const visibilityTrendData = [
    { day: 'Day 1', score: 72 },
    { day: 'Day 2', score: 74 },
    { day: 'Day 3', score: 71 },
    { day: 'Day 4', score: 76 },
    { day: 'Day 5', score: 75 },
    { day: 'Day 6', score: 77 },
    { day: 'Day 7', score: 78 },
  ];


  const currentScore = visibilityTrendData[visibilityTrendData.length - 1]?.score || 78;
  const previousScore = visibilityTrendData[visibilityTrendData.length - 2]?.score || 77;
  const scoreChange = currentScore - previousScore;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <HeaderBar />

        {/* Filters */}
        <Filters />

        {/* Main Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Good morning! ☕</h1>
              <p className="text-lg text-gray-600 mt-2">
                Here's your brand's strategic priorities for today
              </p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-500 font-medium">Active Prompts</div>
                <div className="text-2xl font-bold text-gray-900">247</div>
                <div className="text-xs text-green-600">+12 this week</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-500 font-medium">Top 3 Rankings</div>
                <div className="text-2xl font-bold text-gray-900">34</div>
                <div className="text-xs text-green-600">+5 this week</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-500 font-medium">Content Gaps</div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-blue-600">High opportunity</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-500 font-medium">Avg. Rank</div>
                <div className="text-2xl font-bold text-gray-900">4.2</div>
                <div className="text-xs text-yellow-600">Needs improvement</div>
              </div>
            </div>

            {/* Recent Competitor Activity */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Competitor Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-medium text-gray-900">Ford</span>
                        <span className="text-sm text-gray-500">captured #2 ranking</span>
                      </div>
                      <p className="text-sm text-gray-600">"electric vehicle charging network"</p>
                    </div>
                    <RankingChallengeButton
                      competitor="Ford"
                      prompt="electric vehicle charging network"
                      ranking={2}
                      onChallenge={handleChallenge}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-medium text-gray-900">Rivian</span>
                        <span className="text-sm text-gray-500">mentioned 15 times today</span>
                      </div>
                      <p className="text-sm text-gray-600">"EV truck comparison"</p>
                    </div>
                    <MentionChallengeButton
                      competitor="Rivian"
                      prompt="EV truck comparison"
                      onChallenge={handleChallenge}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Visibility Score KPI */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Brand Visibility Score</h2>
                    <p className="text-sm text-gray-600">Your overall AI search presence</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Score Display */}
                  <div className="flex items-center space-x-6">
                    <div>
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {currentScore}
                        <span className="text-2xl text-gray-500 font-normal">/100</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className={`w-4 h-4 ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm font-medium ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scoreChange >= 0 ? '+' : ''}{scoreChange} from yesterday
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={visibilityTrendData}>
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Hub */}
            <ActionHub />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;