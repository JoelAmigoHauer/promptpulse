# PromptPulse AEO Dashboard - Complete Structure

## 🎯 **Sidebar Navigation Structure** (Inspired by peec.ai)

### **Workspace Selector**
- **Component**: Tesla with dropdown arrow
- **Function**: Primary context switcher for entire application
- **Workspaces**: Tesla, Apple, Google, Microsoft
- **Features**:
  - Brand-colored avatars (Tesla=Red, Apple=Gray, Google=Blue, Microsoft=Blue)
  - Dropdown to switch between monitored brands
  - Refreshes entire dashboard with selected brand's data

---

## 📁 **Navigation Groups**

### **🔧 General** - Core AEO monitoring tools

#### **1. Dashboard** ⭐ *Active*
- **Icon**: 2x2 grid (layout-dashboard)
- **Purpose**: AEO Action Dashboard overview
- **Components**:
  - Visibility Chart (tracks brand visibility over time)
  - Industry Ranking Table (competitive positioning)
  - Opportunity Feed (actionable alerts and content gaps)

#### **2. Rankings**
- **Icon**: Bar chart (bar-chart-3)
- **Purpose**: Competitive landscape analysis
- **Features**:
  - Comprehensive ranking table (sortable, filterable)
  - Keyword-level rankings (SERP-like AI mention rankings)
  - Head-to-head brand comparisons
  - Trend data over various timeframes (7d, 30d, 90d)

#### **3. Sources**
- **Icon**: Link (link)
- **Purpose**: URL citation tracking
- **Features**:
  - Top cited pages (user's URLs ranked by AI citations)
  - Competitor top sources (competitor URLs being cited)
  - Source analysis (which prompts cite specific URLs)
  - Direct feedback loop for AEO content optimization

#### **4. Prompts**
- **Icon**: Speech bubble (message-square)
- **Purpose**: Query and keyword management
- **Features**:
  - Prompt database (all tracked questions/keywords)
  - Monthly volume estimates and rank tracking
  - Prompt discovery tool (suggests new queries from Reddit, Quora)
  - Tagging and grouping (Safety, Pricing, Features campaigns)

#### **5. Mentions**
- **Icon**: @ symbol (at-sign)
- **Purpose**: Real-time brand mentions feed
- **Features**:
  - Infinite scroll feed (every brand mention)
  - Advanced filtering (AI platform, sentiment, date, prompt)
  - Detailed mention view (full AI response, other brands, sources)
  - Raw granular data behind all charts and scores

#### **6. Competitors**
- **Icon**: Group of people (users)
- **Purpose**: Competitor management
- **Features**:
  - Competitor list management (add/remove by name or domain)
  - Suggested competitors (AI-powered recommendations)
  - Defines competitive set for rankings and comparisons

---

### **⚙️ Settings** - Configuration and administration

#### **7. Team**
- **Icon**: Two figures (users-2)
- **Purpose**: User and team management
- **Features**:
  - Invite members via email
  - Role management (Admin, Editor, Viewer)
  - Collaboration controls for larger organizations

#### **8. Workspace**
- **Icon**: Briefcase (briefcase)
- **Purpose**: Workspace configuration
- **Features**:
  - Workspace name editing
  - API & integrations management (Slack alerts, etc.)
  - Billing & plan information
  - Subscription management

---

## 🎨 **Design System**

### **Visual Hierarchy**
- **Group Headers**: Uppercase, gray-500, semibold, tracking-wide
- **Active States**: Blue-50 background, blue-700 text
- **Hover States**: Gray-50 background with smooth transitions
- **Icons**: Gray-400 default, blue-600 for active, gray-600 on hover

### **Workspace Selector**
- **Brand Colors**: Tesla (red-500), Apple (gray-800), Google (blue-500), Microsoft (blue-600)
- **Avatar System**: Colored squares with white initials
- **Dropdown**: Full workspace switching with visual brand identification

### **Responsive Features**
- **Collapsible Sidebar**: Icon-only mode for smaller screens
- **Tooltips**: Full descriptions on collapsed icons
- **Smooth Animations**: All state transitions with proper easing

---

## 🔧 **Technical Implementation**

### **React Components**
```
src/components/
├── Sidebar.jsx              # Main navigation component
├── HeaderBar.jsx            # Top timer and help bar
├── Filters.jsx              # Brand/time/tag/model filters
├── IndustryRanking.jsx      # Competitive ranking table
├── RecentMentions.jsx       # Mentions feed container
├── MentionItem.jsx          # Individual mention cards
└── index.js                 # Component exports
```

### **State Management**
- **Workspace Selection**: Tesla, Apple, Google, Microsoft switching
- **Navigation State**: Active page tracking
- **Collapse State**: Sidebar expand/collapse
- **Filter States**: Brand, time range, tags, AI models

### **Data Flow**
1. **Workspace Selection** → Triggers full data refresh
2. **Navigation Selection** → Changes main content area
3. **Filter Changes** → Updates displayed data
4. **Real-time Updates** → Mentions feed auto-refresh

---

## 🚀 **Key Innovations**

### **AEO-Specific Features**
- **AI Platform Tracking**: OpenAI, Claude, Gemini integration
- **Citation Analysis**: URL source tracking and optimization feedback
- **Prompt Management**: Query discovery and campaign organization
- **Competitive Intelligence**: Real-time ranking against competitors

### **User Experience**
- **Context Switching**: Seamless brand workspace switching
- **Logical Grouping**: Clear separation of monitoring vs. settings
- **Progressive Disclosure**: Descriptions under labels for clarity
- **Professional Polish**: Inspired by best-in-class SaaS interfaces

This structure provides a complete, production-ready AEO platform interface that scales from individual brand monitoring to enterprise competitive intelligence.