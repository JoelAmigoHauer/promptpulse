import React from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <nav className="flex justify-between items-center p-6 text-white">
        <div className="text-2xl font-bold">PromptPulse</div>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100">
            Sign In
          </Link>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">
          Monitor Your Brand Across AI Platforms
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Track how AI assistants like ChatGPT, Claude, and Gemini mention your brand. 
          Get insights, sentiment analysis, and competitive intelligence.
        </p>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
          >
            Get Started
          </Link>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Platform Monitoring</h3>
            <p>Track mentions across ChatGPT, Claude, Gemini, and more</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
            <p>Understand how AI perceives your brand with detailed analytics</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
            <p>Get notified when your brand sentiment changes significantly</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
