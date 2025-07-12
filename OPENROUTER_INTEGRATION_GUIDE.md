# PromptPulse OpenRouter Integration Guide

## 🎯 **Data Flows Overview**

The PromptPulse platform now includes comprehensive OpenRouter API integration for real-time competitive analysis across ChatGPT, Claude, and Gemini. Here are the key data flows you need to understand for testing:

## 🔄 **Core Data Flows**

### **1. Real-Time Prompt Testing Flow**
```
User Input → Frontend → `/api/brands/test-prompt` → OpenRouter Service → ChatGPT/Claude/Gemini → Competitive Analysis → Frontend Display
```

**Data Structure:**
- **Input:** Prompt, brand name, competitors list
- **Processing:** Simultaneous testing across all 3 AI providers
- **Output:** Rankings, sentiment analysis, competitive gaps, improvement opportunities

### **2. Content Grading Flow**
```
Content Input → Frontend → `/api/brands/grade-content` → OpenRouter Service → Claude Analysis → Grade Calculation → Celebration Trigger
```

**Data Structure:**
- **Input:** Prompt, content text, brand name
- **Processing:** AI-powered content analysis using Claude
- **Output:** A-F grade, numerical scores, strengths/weaknesses, recommendations

### **3. Real-Time Mentions Flow**
```
Brand Monitoring → `/api/brands/realtime-mentions` → OpenRouter Service → Multi-Provider Testing → Mention Aggregation → Live Feed Update
```

**Data Structure:**
- **Input:** Brand name, monitoring prompts
- **Processing:** Continuous prompt testing for brand mentions
- **Output:** Live mention feed, sentiment tracking, competitive landscape

## 🚀 **Setup Instructions**

### **1. Environment Configuration**

```bash
# 1. Copy environment template
cp promptpulse-backend/.env.example promptpulse-backend/.env

# 2. Get OpenRouter API Key
# Visit: https://openrouter.ai/
# Sign up and get your API key

# 3. Configure .env file
OPENROUTER_API_KEY=your_actual_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### **2. Backend Setup**

```bash
cd promptpulse-backend

# Install dependencies
pip install -r requirements.txt

# Install additional dependencies for OpenRouter
pip install aiohttp python-dotenv

# Test the integration
python test_realtime_integration.py
```

### **3. Frontend Setup**

```bash
cd promptpulse-frontend

# Install dependencies
npm install

# Set API URL (if different from default)
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

## 🧪 **Testing the Integration**

### **1. Run Integration Tests**

```bash
cd promptpulse-backend
python test_realtime_integration.py
```

This will test:
- ✅ API connectivity
- ✅ Real-time prompt analysis
- ✅ Content grading
- ✅ Data flow validation

### **2. Test Frontend Integration**

1. **Start Backend:**
   ```bash
   cd promptpulse-backend
   python src/main.py
   ```

2. **Start Frontend:**
   ```bash
   cd promptpulse-frontend
   npm start
   ```

3. **Test Workflows:**
   - Navigate to Dashboard
   - Click on Content Gap card
   - Use "Generate Content Brief" button
   - Test Content Grader with real content
   - Check real-time mention feeds

## 📊 **Key API Endpoints**

### **Real-Time Testing**
```http
POST /api/brands/test-prompt
{
  "prompt": "best electric vehicle",
  "brand_name": "Tesla",
  "competitors": ["Ford", "GM", "Rivian"]
}
```

### **Content Grading**
```http
POST /api/brands/grade-content
{
  "prompt": "EV truck comparison",
  "content": "Your content here...",
  "brand_name": "Tesla"
}
```

### **Live Mentions**
```http
GET /api/brands/realtime-mentions?brand_name=Tesla&limit=10
```

## 🎮 **Frontend Integration Points**

### **1. Content Grader Component**
```javascript
import { realtimeApi } from '../services/realtimeApi';

const gradeResult = await realtimeApi.gradeContent(prompt, content);
if (gradeResult.success) {
  // Trigger celebration animation if grade improved
  triggerCelebration(gradeResult.overallGrade);
}
```

### **2. Real-Time Prompt Testing**
```javascript
const testResult = await realtimeApi.testPrompt(
  "best electric vehicle", 
  "Tesla", 
  ["Ford", "GM", "Rivian"]
);
// Display competitive analysis results
```

### **3. Live Mention Monitoring**
```javascript
const mentions = await realtimeApi.getRealtimeMentions("Tesla");
// Update live feed component
```

## 🔧 **Configuration Options**

### **Backend Configuration (config.py)**
```python
# OpenRouter settings
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Rate limiting
API_RATE_LIMIT = 100  # requests per minute
CONCURRENT_REQUESTS = 3  # parallel AI provider calls

# Testing mode
MOCK_AI_RESPONSES = False  # Set True for testing without API calls
```

### **Frontend Configuration (.env)**
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_POLLING_INTERVAL=30000  # 30 seconds for live updates
```

## 📈 **Data Flow Examples**

### **Content Gap Analysis Flow**
```
1. User sees content gap on dashboard
2. Clicks "Generate Content Brief"
3. Frontend calls /api/brands/test-prompt
4. Backend tests prompt across ChatGPT/Claude/Gemini
5. Results show competitive positioning
6. User creates content based on insights
7. Uses Content Grader to optimize
8. Celebration animation triggers on improvement
```

### **Real-Time Competitive Monitoring**
```
1. System continuously monitors prompts
2. /api/brands/realtime-mentions endpoint
3. Tests brand mentions across AI providers
4. Aggregates sentiment and ranking data
5. Updates live feed in Mentions page
6. Triggers alerts for ranking changes
```

## 🚨 **Important Considerations**

### **1. API Rate Limits**
- OpenRouter has usage limits based on your plan
- The system automatically throttles requests
- Use `MOCK_AI_RESPONSES=True` for development testing

### **2. Cost Management**
- Each prompt test calls 3 AI providers
- Monitor your OpenRouter usage dashboard
- Consider caching results for repeated prompts

### **3. Error Handling**
- All endpoints include fallback responses
- Frontend gracefully handles API failures
- Test with invalid API keys to verify error states

### **4. Real-Time Performance**
- Prompt testing takes 2-5 seconds per provider
- Parallel execution reduces total time
- Consider WebSocket upgrades for instant updates

## 🎯 **Success Metrics**

Your integration is working correctly when:

- ✅ **Prompt Testing:** Returns rankings from all 3 providers
- ✅ **Content Grading:** Provides A-F grades with detailed feedback  
- ✅ **Live Mentions:** Shows real brand mentions with sentiment
- ✅ **Celebrations:** Animations trigger on grade improvements
- ✅ **Challenge Buttons:** Connect to real competitive data
- ✅ **Dashboard:** Displays live competitive intelligence

## 🔄 **Next Steps**

1. **Test with your OpenRouter API key**
2. **Verify all data flows work end-to-end**
3. **Customize prompts for your specific brand/industry**
4. **Set up monitoring for key competitive prompts**
5. **Integrate celebration animations with real improvements**

The platform now provides real-time competitive intelligence across all major AI platforms, enabling true AEO (AI Engine Optimization) strategies.