import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchBrand } from '../services/api'

function BrandsPage({ onLogout }) {
  const [brand, setBrand] = useState('Tesla')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savedSearches, setSavedSearches] = useState([])
  const [searchHistory, setSearchHistory] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await searchBrand(brand)
      setResults(data)
      
      // Add to search history
      const newHistoryItem = {
        brand: brand,
        timestamp: new Date().toISOString(),
        mentions: data.total_mentions,
        visibility: data.visibility_score
      }
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]) // Keep last 10
      
    } catch (err) {
      setError(err.message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const saveSearch = () => {
    if (results && !savedSearches.find(s => s.brand === brand)) {
      const savedItem = {
        brand: brand,
        timestamp: new Date().toISOString(),
        mentions: results.total_mentions,
        visibility: results.visibility_score,
        sentiment: results.sentiment_distribution
      }
      setSavedSearches(prev => [...prev, savedItem])
    }
  }

  const loadSavedSearch = (savedBrand) => {
    setBrand(savedBrand)
  }

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

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  {searchHistory.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                         onClick={() => loadSavedSearch(item.brand)}>
                      <span className="font-medium">{item.brand}</span>
                      <span className="text-xs text-gray-500">{item.mentions}m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">Saved Searches</h3>
                <div className="space-y-2">
                  {savedSearches.map((item, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => loadSavedSearch(item.brand)}>{item.brand}</span>
                        <span className="text-xs text-gray-500">⭐</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.mentions} mentions • {item.visibility.toFixed(1)} score
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Brand Intelligence Search</h2>
              <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 flex-1"
                  placeholder="Enter brand name (e.g. Tesla, Apple, Google)"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Search'}
                </button>
                {results && (
                  <button
                    type="button"
                    onClick={saveSearch}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={savedSearches.find(s => s.brand === brand)}
                  >
                    Save
                  </button>
                )}
              </form>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {results && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{results.brand_name || brand} Results</h3>
                <div className="flex flex-wrap gap-6 mb-2">
                  <div>
                    <span className="text-gray-500">Total Mentions: </span>
                    <span className="font-bold text-purple-700">{results.total_mentions}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Visibility Score: </span>
                    <span className="font-bold text-green-600">{results.visibility_score}</span>
                  </div>
                </div>
                <div className="flex gap-4 mb-2">
                  <div className="text-green-600">Positive: {results.sentiment_distribution?.positive || 0}</div>
                  <div className="text-yellow-600">Neutral: {results.sentiment_distribution?.neutral || 0}</div>
                  <div className="text-red-600">Negative: {results.sentiment_distribution?.negative || 0}</div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Mentions</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.mentions && results.mentions.length > 0 ? (
                    (() => {
                      // Get a mix of providers for better display
                      const openaiMentions = results.mentions.filter(m => m.provider === 'openai').slice(0, 4);
                      const anthropicMentions = results.mentions.filter(m => m.provider === 'anthropic').slice(0, 4);
                      const googleMentions = results.mentions.filter(m => m.provider === 'google').slice(0, 4);
                      const mixedMentions = [...openaiMentions, ...anthropicMentions, ...googleMentions];
                      return mixedMentions.map((mention, idx) => (
                      <div key={idx} className="border rounded p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-purple-700">{mention.provider?.toUpperCase() || 'AI'}</span>
                          <span className="text-xs text-gray-500">Sentiment: <span className={
                            mention.sentiment_label === 'positive' ? 'text-green-600' :
                            mention.sentiment_label === 'negative' ? 'text-red-600' :
                            'text-yellow-600'
                          }>{mention.sentiment_label}</span></span>
                          <span className="text-xs text-gray-500">Confidence: {mention.confidence}</span>
                        </div>
                        <div className="mb-2 text-gray-800">{mention.content?.slice(0, 300)}{mention.content?.length > 300 ? '...' : ''}</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {mention.keywords_found && mention.keywords_found.map((kw, i) => (
                            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{kw}</span>
                          ))}
                        </div>
                        {mention.source_urls && mention.source_urls.length > 0 && (
                          <div className="mt-2 text-xs text-blue-600">
                            Sources: {mention.source_urls.slice(0,2).map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline mr-2">{url}</a>
                            ))}
                          </div>
                        )}
                      </div>
                    ));
                    })()
                  ) : (
                    <div className="text-gray-500">No mentions found.</div>
                  )}
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandsPage
