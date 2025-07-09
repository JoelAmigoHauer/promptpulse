import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function BrandsPage({ onLogout }) {
  const [brands] = useState([
    {
      id: 1,
      name: "TechCorp",
      description: "Technology solutions company",
      keywords: ["TechCorp", "tech solutions"],
      mentions: 156,
      sentiment: { positive: 70, neutral: 20, negative: 10 }
    },
    {
      id: 2,
      name: "EcoGreen",
      description: "Sustainable products company",
      keywords: ["EcoGreen", "sustainable"],
      mentions: 89,
      sentiment: { positive: 80, neutral: 15, negative: 5 }
    },
    {
      id: 3,
      name: "FinanceFirst",
      description: "Financial services provider",
      keywords: ["FinanceFirst", "banking"],
      mentions: 134,
      sentiment: { positive: 60, neutral: 30, negative: 10 }
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">PromptPulse</h1>
              <div className="ml-10 flex space-x-8">
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 py-2">
                  Dashboard
                </Link>
                <Link to="/brands" className="text-purple-600 border-b-2 border-purple-600 py-2">
                  Brands
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Add Brand
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-600 mb-4">{brand.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {brand.keywords.map((keyword, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Total Mentions: <span className="font-semibold">{brand.mentions}</span></p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Sentiment:</p>
                  <div className="flex space-x-2 text-xs">
                    <span className="text-green-600">Positive: {brand.sentiment.positive}%</span>
                    <span className="text-yellow-600">Neutral: {brand.sentiment.neutral}%</span>
                    <span className="text-red-600">Negative: {brand.sentiment.negative}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 text-sm">
                    Edit
                  </button>
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandsPage
