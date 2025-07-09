# 🚀 PromptPulse Brand Intelligence Engine Setup Guide

Complete step-by-step guide to configure and test the Brand Intelligence Engine.

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL database
- Redis server
- API keys from OpenAI, Anthropic, and Google AI

## 🔧 Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /opt/promptpulse-repo/promptpulse-backend
pip install -r requirements.txt
```

### 2. Configure API Keys

Edit the `.env` file with your actual API keys:

```env
# API Keys - Replace with your actual keys
OPENAI_API_KEY=sk-your-actual-openai-key-here
GOOGLE_AI_API_KEY=your-actual-google-ai-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
```

#### Getting API Keys:

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

**Google AI API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy the key (usually starts with `AI...`)

**Anthropic API Key:**
1. Go to https://console.anthropic.com/
2. Navigate to "API Keys" section
3. Click "Create Key"
4. Copy the key (starts with `sk-ant-`)

### 3. Test Dependencies

Run the dependency checker:

```bash
python check_dependencies.py
```

Expected output:
```
✅ All dependencies are installed!
✅ OpenAI client can be imported
✅ Anthropic client can be imported
✅ Google AI client can be imported
✅ Brand Intelligence Engine can be imported
```

### 4. Test API Connections

Run the API connection test:

```bash
python test_api_connections.py
```

Expected output:
```
🎉 All API providers working! Ready for full brand intelligence searches.
```

### 5. Test Tesla Brand Search

Run the Tesla search test:

```bash
python test_tesla_search.py
```

This will:
- Search for Tesla across all AI platforms
- Analyze sentiment and calculate visibility score
- Export results to `tesla_search_results.json`
- Display comprehensive brand intelligence report

## 🔍 Understanding the Results

### Brand Visibility Score (0-100)
- **0-25**: Low visibility
- **26-50**: Moderate visibility
- **51-75**: Good visibility
- **76-100**: High visibility

### Sentiment Analysis
- **Very Positive (5)**: Extremely positive mentions
- **Positive (4)**: Generally positive mentions
- **Neutral (3)**: Balanced or factual mentions
- **Negative (2)**: Generally negative mentions
- **Very Negative (1)**: Extremely negative mentions

### Confidence Scores
- **0.0-0.3**: Low confidence
- **0.4-0.6**: Moderate confidence
- **0.7-0.9**: High confidence
- **0.9-1.0**: Very high confidence

## 🚀 Using the API

### Start the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Search Brand Mentions

```bash
curl -X POST "http://localhost:8000/api/brands/search" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Tesla",
    "keywords": ["electric vehicles", "Elon Musk", "autopilot"],
    "save_to_db": true
  }'
```

### Response Format

```json
{
  "brand_name": "Tesla",
  "total_mentions": 15,
  "sentiment_distribution": {
    "positive": 8,
    "neutral": 4,
    "negative": 3
  },
  "visibility_score": 78.5,
  "mentions": [
    {
      "content": "Tesla's latest autopilot features...",
      "sentiment_score": 4,
      "sentiment_label": "positive",
      "confidence": 0.85,
      "provider": "openai",
      "keywords_found": ["autopilot", "Tesla"]
    }
  ],
  "analysis_metadata": {
    "providers_used": ["openai", "anthropic", "google"],
    "avg_confidence": 0.82,
    "unique_sources": 12
  }
}
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/brands/search` | POST | Search brand mentions |
| `/api/brands/` | GET | List all brands |
| `/api/brands/` | POST | Create new brand |
| `/api/brands/{id}` | GET | Get specific brand |
| `/api/brands/{id}/mentions` | GET | Get brand mentions |
| `/api/brands/{id}/analysis` | GET | Get latest analysis |
| `/api/brands/{id}/analyze` | POST | Trigger new analysis |

## 🔧 Troubleshooting

### Common Issues

**1. API Key Errors**
```
❌ OpenAI API Error: Incorrect API key provided
```
- Solution: Double-check your API key in `.env`
- Ensure the key has sufficient credits/quota

**2. Import Errors**
```
❌ Brand Intelligence Engine import error
```
- Solution: Run `pip install -r requirements.txt`
- Check Python path configuration

**3. Database Connection Issues**
```
❌ Database connection failed
```
- Solution: Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`

**4. No Results from Search**
```
Total Mentions Found: 0
```
- Solution: Check if at least one API key is working
- Try different keywords or brand names
- Verify API quotas aren't exceeded

### Performance Tips

1. **API Rate Limits**: The system respects rate limits automatically
2. **Cost Optimization**: Use shorter keyword lists for testing
3. **Caching**: Results are cached in the database to avoid repeated searches
4. **Async Processing**: Large searches run in background tasks

## 🎯 Next Steps

1. **Frontend Integration**: Connect the React frontend to display results
2. **Real-time Monitoring**: Set up scheduled searches with Celery
3. **Advanced Analytics**: Add trend analysis and competitive intelligence
4. **Alerting**: Configure notifications for sentiment changes
5. **Export Features**: Add PDF/CSV export functionality

## 📈 Monitoring

Monitor your API usage:
- **OpenAI**: https://platform.openai.com/usage
- **Anthropic**: https://console.anthropic.com/
- **Google AI**: https://makersuite.google.com/

## 🔐 Security

- Keep API keys secure and never commit them to version control
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Monitor API usage for unusual activity

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the test scripts output
3. Verify all dependencies are installed
4. Ensure API keys are valid and have sufficient quota

Happy brand monitoring! 🚀