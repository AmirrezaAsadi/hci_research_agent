# SIGCHI UC - HCI Research Trends Platform

## 🎯 Project Overview

A **simple, focused platform** for the ACM SIGCHI UC Student Chapter that automatically discovers HCI research trends, generates student-friendly content, and creates engaging social media posts.

### **What It Does**
1. **Searches ArXiv** daily for new HCI papers
2. **Extracts & tracks keywords** to identify trending topics  
3. **Generates summaries** using Grok AI for undergraduate students
4. **Creates visual content** with AI-generated images
5. **Builds weekly reports** showing research trends
6. **Posts to social media** with proper attribution links
7. **Displays everything** on a clean, modern website

### **Target Audience**
- SIGCHI UC Student Chapter members
- Undergraduate students interested in HCI
- Social media followers of SIGCHI UC

## 🏗️ Architecture

```
Frontend (Vercel)          Backend (Railway)           External APIs
┌─────────────────┐       ┌──────────────────┐       ┌─────────────┐
│                 │       │                  │       │             │
│   Next.js 14    │◄──────┤   FastAPI        │◄──────┤ ArXiv API   │
│   Paper Display │       │   LangGraph      │       │             │
│   Trend Charts  │       │   Agents         │       └─────────────┘
│   Weekly Reports│       │                  │       ┌─────────────┐
│                 │       │   PostgreSQL     │◄──────┤ Grok API    │
└─────────────────┘       │   File Storage   │       │             │
                          └──────────────────┘       └─────────────┘
                                    │                 ┌─────────────┐
                                    └─────────────────┤Grok-2-Image │
                                                      │   1212      │
                                                      └─────────────┘
```

## ⚡ Core Features

### **1. Automated Paper Discovery**
- Daily ArXiv search for HCI papers (`cs.HC`, `cs.AI`, `cs.CY`)
- Smart keyword filtering for HCI relevance
- Stores paper metadata + ArXiv/PDF links

### **2. Intelligent Keyword Tracking**
- Extracts keywords from ArXiv categories + paper content
- Tracks keyword frequency over time
- Calculates trending scores and emerging topics
- Identifies hot research areas

### **3. Student-Friendly Content Generation**
- 100-word summaries optimized for undergraduates (Grok API)
- AI-generated images using **Grok-2-Image-1212** model
- Visual illustrations of research concepts and trends
- Difficulty level assessment
- Prerequisites identification

**Grok Image Generation:**
```python
# Paper illustrations - Visual representation of research
"Clean academic illustration of {hci_concept}, modern style, blue/purple theme"

# Trend visualizations - Data charts and infographics  
"Modern infographic showing trending HCI keywords with growth percentages"

# Social media cards - Branded sharing content
"Professional social card for SIGCHI UC featuring paper title and summary"
```

### **4. Trend Analysis & Reporting**
- Weekly trend reports in Markdown format
- Visual charts showing keyword popularity
- "Hot topics" and "emerging areas" identification
- Research direction predictions

### **5. Social Media Automation**
- Auto-generated posts for Twitter/LinkedIn
- Includes paper summary, image, and ArXiv link
- Branded SIGCHI UC content
- Hashtag optimization

### **6. Clean Web Interface**
- Browse recent papers with filters
- View trending keywords dashboard
- Read weekly reports
- Search by keyword/topic
- Mobile-responsive design

## 🛠️ Technology Stack

### **Backend (Railway)**
```python
# Core Framework
FastAPI + LangGraph

# AI/ML
langchain==0.1.0
langgraph==0.0.40
requests==2.31.0  # For Grok API (text + image)

# Database & Storage
sqlalchemy==2.0.23
psycopg2-binary==2.9.9  # PostgreSQL
pandas==2.1.0  # Data analysis

# Background Processing
celery==5.3.0
redis==4.5.0

# Content Generation
Pillow==10.0.0  # Image processing
matplotlib==3.7.0  # Charts
jinja2==3.1.0  # Templates
```

### **Frontend (Vercel)**
```json
{
  "dependencies": {
    "next": "^14.0.3",
    "react": "^18.2.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.3.5",
    "lucide-react": "^0.292.0",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.5"
  }
}
```

## 🗂️ Data Structure

### **File Organization**
```
/data/
├── papers/
│   ├── 2024-11/
│   │   ├── papers.json         # Paper metadata
│   │   ├── summaries.json      # AI summaries
│   │   └── keywords.json       # Extracted keywords
├── trends/
│   ├── weekly/
│   │   ├── 2024-week-45.json   # Trend calculations
│   │   └── 2024-week-45.md     # Generated report
│   └── charts/
│       └── trending-keywords-2024-11.png
├── images/
│   ├── papers/
│   │   ├── 2311.12345.png      # Paper illustrations
│   │   └── 2311.12346.png
│   └── social/
│       ├── twitter-post-001.png
│       └── linkedin-post-001.png
└── reports/
    ├── weekly-2024-11-04.md
    └── monthly-2024-11.md
```

### **Database Schema**
```sql
-- Papers table
CREATE TABLE papers (
    id SERIAL PRIMARY KEY,
    arxiv_id VARCHAR(20) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    authors JSONB NOT NULL,
    abstract TEXT NOT NULL,
    arxiv_categories JSONB NOT NULL,
    published_date DATE NOT NULL,
    arxiv_url VARCHAR(255) NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Keywords table
CREATE TABLE keywords (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER REFERENCES papers(id),
    keyword VARCHAR(100) NOT NULL,
    source VARCHAR(20) NOT NULL, -- 'arxiv' or 'extracted'
    confidence FLOAT DEFAULT 1.0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Summaries table
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER REFERENCES papers(id),
    summary_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    difficulty_level VARCHAR(20),
    generated_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trends table
CREATE TABLE trends (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    week_start DATE NOT NULL,
    frequency INTEGER NOT NULL,
    trending_score FLOAT NOT NULL,
    growth_rate FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 LangGraph Agent Workflow

### **Agent Definitions**
```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict

class AgentState(TypedDict):
    papers: List[Dict]
    keywords: List[Dict]
    trends: Dict
    summaries: List[Dict]
    images: List[str]
    reports: List[str]
    social_posts: List[Dict]
    current_step: str

# Create workflow
workflow = StateGraph(AgentState)

# Add agents
workflow.add_node("arxiv_searcher", arxiv_search_agent)
workflow.add_node("keyword_extractor", keyword_extraction_agent)
workflow.add_node("trend_calculator", trend_analysis_agent)
workflow.add_node("summarizer", summary_generation_agent)
workflow.add_node("image_generator", image_creation_agent)
workflow.add_node("report_builder", report_generation_agent)
workflow.add_node("social_creator", social_media_agent)

# Define flow
workflow.add_edge("arxiv_searcher", "keyword_extractor")
workflow.add_edge("keyword_extractor", "trend_calculator")
workflow.add_edge("trend_calculator", "summarizer")
workflow.add_edge("summarizer", "image_generator")
workflow.add_edge("image_generator", "report_builder")
workflow.add_edge("report_builder", "social_creator")
workflow.add_edge("social_creator", END)

workflow.set_entry_point("arxiv_searcher")
app = workflow.compile()
```

### **Core Agents**

#### **1. ArXiv Search Agent**
```python
@tool
def arxiv_search_agent(state: AgentState) -> AgentState:
    """
    Searches ArXiv for recent HCI papers
    - Categories: cs.HC, cs.AI, cs.CV, cs.LG
    - Time range: Last 7 days
    - Keywords: HCI-related terms
    - Output: List of papers with metadata
    """
    
    papers = search_arxiv_hci_papers(days_back=7, max_results=50)
    state["papers"] = papers
    state["current_step"] = "papers_found"
    return state
```

#### **2. Keyword Extraction Agent**
```python
@tool
def keyword_extraction_agent(state: AgentState) -> AgentState:
    """
    Extracts keywords from papers
    - Uses ArXiv categories + custom NLP extraction
    - Categorizes keywords (methods, applications, technologies)
    - Calculates confidence scores
    - Output: Keyword lists per paper
    """
    
    keywords = []
    for paper in state["papers"]:
        extracted = extract_keywords_from_paper(paper)
        keywords.extend(extracted)
    
    state["keywords"] = keywords
    state["current_step"] = "keywords_extracted"
    return state
```

#### **3. Trend Analysis Agent**
```python
@tool
def trend_analysis_agent(state: AgentState) -> AgentState:
    """
    Calculates trending keywords and topics
    - Compares current vs historical frequency
    - Identifies emerging topics (new + growing)
    - Calculates trend scores
    - Output: Trending analysis data
    """
    
    trends = calculate_keyword_trends(state["keywords"])
    state["trends"] = trends
    state["current_step"] = "trends_calculated"
    return state
```

#### **4. Summary Generation Agent**
```python
@tool
def summary_generation_agent(state: AgentState) -> AgentState:
    """
    Generates student-friendly summaries
    - Uses Grok API for undergraduate-level summaries
    - 100-word target length
    - Difficulty assessment
    - Output: Summaries for each paper
    """
    
    summaries = []
    for paper in state["papers"]:
        summary = generate_grok_summary(paper, target_words=100)
        summaries.append(summary)
    
    state["summaries"] = summaries
    state["current_step"] = "summaries_generated"
    return state
```

#### **5. Image Generation Agent**
```python
@tool
def image_creation_agent(state: AgentState) -> AgentState:
    """
    Creates visual content for papers and trends
    - Grok-2-Image-1212 for paper illustrations
    - Matplotlib for trend charts
    - Social media card templates
    - Output: Image URLs and files
    """
    
    images = []
    
    # Generate paper illustrations using Grok
    for paper in state["papers"]:
        image_url = generate_paper_illustration_grok(paper)
        images.append({"type": "paper", "paper_id": paper["id"], "url": image_url})
    
    # Generate trend charts
    trend_chart = create_trend_visualization(state["trends"])
    images.append({"type": "trend", "url": trend_chart})
    
    state["images"] = images
    state["current_step"] = "images_created"
    return state
```

#### **6. Report Generation Agent**
```python
@tool
def report_generation_agent(state: AgentState) -> AgentState:
    """
    Builds weekly markdown reports
    - Combines papers, trends, and summaries
    - Creates readable markdown format
    - Includes statistics and insights
    - Output: Report files and metadata
    """
    
    report = build_weekly_report(
        papers=state["papers"],
        trends=state["trends"],
        summaries=state["summaries"]
    )
    
    state["reports"] = [report]
    state["current_step"] = "reports_built"
    return state
```

#### **7. Social Media Agent**
```python
@tool
def social_media_agent(state: AgentState) -> AgentState:
    """
    Creates social media posts
    - Twitter/LinkedIn formatted posts
    - Includes paper link and image
    - SIGCHI UC branding
    - Output: Ready-to-post content
    """
    
    posts = []
    for paper in state["papers"][:5]:  # Top 5 papers
        post = create_social_media_post(
            paper=paper,
            summary=get_summary_for_paper(paper, state["summaries"]),
            image=get_image_for_paper(paper, state["images"])
        )
        posts.append(post)
    
    state["social_posts"] = posts
    state["current_step"] = "social_posts_created"
    return state
```

## 🌐 Website Pages

### **Frontend Route Structure**
```
/                           # Homepage with recent papers + trends
/papers                     # All papers with search/filter
/papers/[arxiv_id]         # Individual paper page
/trends                     # Trending keywords dashboard
/trends/weekly             # Weekly trend reports
/reports                   # All generated reports
/reports/[week]            # Specific week report
/about                     # About SIGCHI UC
```

### **Key Components**

#### **Homepage** (`/`)
```typescript
// Shows:
- Trending keywords (last 7 days)
- Latest 10 papers with summaries
- Current week's highlights
- Quick search bar
- Link to full reports
```

#### **Papers Page** (`/papers`)
```typescript
// Features:
- Grid of all papers with images
- Search by title/keywords
- Filter by ArXiv category
- Sort by date/trending score
- Pagination
```

#### **Trends Dashboard** (`/trends`)
```typescript
// Displays:
- Interactive keyword trend charts
- Hot topics vs declining topics
- Emerging research areas
- Category breakdowns (cs.HC vs cs.AI)
- Historical data (last 3 months)
```

#### **Individual Paper** (`/papers/[arxiv_id]`)
```typescript
// Contains:
- Generated illustration image
- Full AI summary for students
- Original ArXiv abstract
- All extracted keywords
- Trending score
- Links to ArXiv + PDF
- Social sharing buttons
```

## 🚀 Implementation Plan

### **Phase 1: Core Agent System** (Week 1-2)
1. Set up LangGraph workflow
2. Implement ArXiv search agent
3. Build keyword extraction
4. Create basic trend calculation
5. Integrate Grok API for summaries

### **Phase 2: Visual Content** (Week 3)
1. Add DALL-E/Midjourney integration
2. Create image generation prompts
3. Build trend visualization charts
4. Design social media templates

### **Phase 3: Web Interface** (Week 4)
1. Build Next.js frontend
2. Create API endpoints
3. Design responsive UI
4. Add search and filtering

### **Phase 4: Automation** (Week 5)
1. Set up daily scheduling
2. Automate report generation
3. Create social media posting
4. Add monitoring and logging

### **Phase 5: Polish & Deploy** (Week 6)
1. Railway + Vercel deployment
2. Performance optimization
3. Error handling
4. Documentation

## 🔧 Configuration

### **Environment Variables**
```bash
# Backend (Railway)
DATABASE_URL=postgresql://...
GROK_API_KEY=your-grok-key  # Used for both text summaries and image generation
REDIS_URL=redis://...

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

### **Scheduling**
```python
# Daily tasks (9 AM UTC)
- Search new ArXiv papers
- Extract keywords
- Generate summaries
- Create images

# Weekly tasks (Sunday 10 AM UTC)  
- Calculate trends
- Generate reports
- Create social posts
- Update trend charts
```

## 📊 Success Metrics

### **Content Metrics**
- Papers processed per week
- Keywords tracked
- Summaries generated
- Images created

### **Trend Insights**
- Hot topics identified
- Emerging areas discovered
- Accurate trend predictions
- Research direction insights

### **Engagement**
- Website visitors
- Paper clicks to ArXiv
- Social media engagement
- Report downloads

## 🎯 Benefits for SIGCHI UC

✅ **Automated Research Discovery** - Never miss important HCI papers  
✅ **Trend Awareness** - See what's hot in HCI research  
✅ **Student-Friendly Content** - Complex research made accessible  
✅ **Visual Appeal** - Generated images increase engagement  
✅ **Social Media Presence** - Regular, valuable content sharing  
✅ **Community Resource** - Central hub for UC HCI students  
✅ **Data-Driven Insights** - Understand research landscape  

## 🚀 Getting Started

### **Quick Setup**
```bash
# 1. Clone repositories
git clone https://github.com/sigchi-uc/hci-trends-backend
git clone https://github.com/sigchi-uc/hci-trends-frontend

# 2. Deploy backend to Railway
railway login
railway init
railway up

# 3. Deploy frontend to Vercel
vercel
vercel --prod

# 4. Configure environment variables
# 5. Test the workflow
# 6. Schedule daily/weekly tasks
```

### **First Run**
1. **Manual trigger** to populate initial data
2. **Test all agents** work correctly  
3. **Verify website** displays properly
4. **Check social posts** are generated
5. **Enable scheduling** for automation

---

**This simple, focused system gives SIGCHI UC everything needed to become the go-to source for HCI research trends at your university!** 🎯

Ready to build the future of student research engagement? 🚀
