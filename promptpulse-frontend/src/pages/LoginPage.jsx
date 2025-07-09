import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo login - any email/password works
    onLogin()
  }

  const handleDemoLogin = () => {
    setEmail('demo@promptpulse.com')
    setPassword('demo123')
    onLogin()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">PromptPulse</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-semibold"
          >
            Try Demo Login
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-purple-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
