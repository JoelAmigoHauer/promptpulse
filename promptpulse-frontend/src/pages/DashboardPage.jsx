import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function DashboardPage({ onLogout }) {
  const [stats, setStats] = useState({
    totalMentions: 379,
    sentiment: { positive: 65, neutral: 25, negative: 10 },
    brands: 3,
    credits: 245
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">PromptPulse</h1>
              <div className="ml-10 flex space-x-8">
                <Link to="/dashboard" className="text-purple-600 border-b-2 border-purple-600 py-2">
                  Dashboard
                </Link>
                <Link to="/brands" className="text-gray-500 hover:text-gray-700 py-2">
                  Brands
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Credits: {stats.credits}/1000</span>
              <button 
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Mentions</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMentions}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Positive Sentiment</h3>
              <p className="text-3xl font-bold text-green-600">{stats.sentiment.positive}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Brands</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.brands}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Credits Used</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.credits}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Mentions</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-sm text-gray-600">ChatGPT mentioned TechCorp positively</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <p className="text-sm text-gray-600">Claude discussed EcoGreen neutrally</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-sm text-gray-600">Gemini recommended FinanceFirst</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Positive</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${stats.sentiment.positive}%`}}></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{stats.sentiment.positive}%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Neutral</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${stats.sentiment.neutral}%`}}></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{stats.sentiment.neutral}%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Negative</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${stats.sentiment.negative}%`}}></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{stats.sentiment.negative}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
