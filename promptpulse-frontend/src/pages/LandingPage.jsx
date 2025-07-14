import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, TrendingUp, Target, Zap, Globe, Users, BarChart3, MessageSquare, Play } from 'lucide-react'

function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const features = [
    {
      icon: Target,
      title: "AI Search Optimization",
      description: "Optimize your brand's presence across ChatGPT, Claude, Gemini, and emerging AI platforms."
    },
    {
      icon: TrendingUp,
      title: "Competitive Intelligence",
      description: "Monitor competitor mentions and identify content gaps to capture market share."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track brand visibility scores, mention sentiment, and ranking positions in real-time."
    },
    {
      icon: MessageSquare,
      title: "Content Strategy",
      description: "Get AI-powered content recommendations to dominate answer engine results."
    }
  ]

  const logos = [
    { name: "OpenAI", width: "w-24" },
    { name: "Anthropic", width: "w-28" },
    { name: "Google", width: "w-20" },
    { name: "Microsoft", width: "w-26" },
    { name: "Meta", width: "w-16" }
  ]

  const testimonials = [
    {
      quote: "PromptPulse helped us capture #1 rankings across 47 AI platforms. Our brand visibility increased 340% in just 3 months.",
      author: "Sarah Chen",
      role: "Head of Digital Marketing",
      company: "TechCorp"
    },
    {
      quote: "The competitive intelligence features are game-changing. We identified content gaps that our competitors missed completely.",
      author: "Marcus Rodriguez",
      role: "Growth Director", 
      company: "StartupXYZ"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PromptPulse</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Sign In
          </Link>
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Optimize your brand for the AI Customer Journey
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Get your brand
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> mentioned by</span>
            </h1>
            
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="text-lg font-semibold text-gray-700">ChatGPT</div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="text-lg font-semibold text-gray-700">Claude</div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="text-lg font-semibold text-gray-700">Gemini</div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="text-lg font-semibold text-gray-700">Perplexity</div>
            </div>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Reach millions of consumers who are using AI to discover new products and brands. 
              Monitor, optimize, and dominate AI search results with real-time competitive intelligence.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <Link 
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof - AI Platform Logos */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-6">Optimize for the platforms that matter</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                {logos.map((logo) => (
                  <div key={logo.name} className={`${logo.width} h-8 bg-gray-200 rounded flex items-center justify-center`}>
                    <span className="text-xs font-medium text-gray-600">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything you need to dominate AI search
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From competitive intelligence to content optimization, PromptPulse gives you the tools to win in the age of AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by growth teams at leading companies
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to dominate AI search?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of brands already optimizing their presence for the AI customer journey.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/login"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2 text-purple-100">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PromptPulse</span>
            </div>
            <div className="text-sm">
              © 2024 PromptPulse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
