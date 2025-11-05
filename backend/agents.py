"""
LangGraph Agents for HCI Research Trends Platform
This module contains all the agents for the workflow
"""
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from datetime import datetime, timedelta
import arxiv
import requests
import json
from database import SessionLocal, Paper, Keyword, Summary, Trend
import config

class AgentState(TypedDict):
    """State shared between agents"""
    papers: List[Dict[str, Any]]
    keywords: List[Dict[str, Any]]
    trends: Dict[str, Any]
    summaries: List[Dict[str, Any]]
    images: List[Dict[str, Any]]
    reports: List[str]
    social_posts: List[Dict[str, Any]]
    current_step: str
    error: str | None

def arxiv_search_agent(state: AgentState) -> AgentState:
    """
    Agent 1: Search ArXiv for recent HCI papers
    """
    print("🔍 ArXiv Search Agent: Starting paper search...")
    
    try:
        db = SessionLocal()
        papers = []
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=config.ARXIV_DAYS_BACK)
        
        # Search ArXiv for each category
        search_query = (
            "cat:cs.HC OR cat:cs.AI OR cat:cs.CY OR cat:cs.CV OR cat:cs.LG "
            "AND (HCI OR human-computer interaction OR user interface OR UX)"
        )
        
        search = arxiv.Search(
            query=search_query,
            max_results=config.ARXIV_MAX_RESULTS,
            sort_by=arxiv.SortCriterion.SubmittedDate,
            sort_order=arxiv.SortOrder.Descending
        )
        
        for result in search.results():
            # Check if paper already exists
            existing = db.query(Paper).filter(Paper.arxiv_id == result.entry_id.split('/')[-1]).first()
            if existing:
                continue
            
            paper_data = {
                'arxiv_id': result.entry_id.split('/')[-1],
                'title': result.title,
                'authors': [author.name for author in result.authors],
                'abstract': result.summary,
                'categories': result.categories,
                'published_date': result.published.date(),
                'arxiv_url': result.entry_id,
                'pdf_url': result.pdf_url
            }
            
            # Store in database
            paper = Paper(
                arxiv_id=paper_data['arxiv_id'],
                title=paper_data['title'],
                authors=paper_data['authors'],
                abstract=paper_data['abstract'],
                arxiv_categories=paper_data['categories'],
                published_date=paper_data['published_date'],
                arxiv_url=paper_data['arxiv_url'],
                pdf_url=paper_data['pdf_url']
            )
            db.add(paper)
            db.commit()
            db.refresh(paper)
            
            paper_data['id'] = paper.id
            papers.append(paper_data)
        
        db.close()
        
        state['papers'] = papers
        state['current_step'] = 'papers_found'
        state['error'] = None
        print(f"✅ ArXiv Search Agent: Found {len(papers)} new papers")
        
    except Exception as e:
        print(f"❌ ArXiv Search Agent Error: {str(e)}")
        state['error'] = str(e)
        state['papers'] = []
    
    return state

def keyword_extraction_agent(state: AgentState) -> AgentState:
    """
    Agent 2: Extract keywords from papers using NLP techniques
    """
    print("🔑 Keyword Extraction Agent: Extracting keywords...")
    
    try:
        db = SessionLocal()
        keywords = []
        
        # Stop words to exclude
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
            'those', 'we', 'our', 'us', 'they', 'their', 'them', 'it', 'its',
            'which', 'who', 'what', 'where', 'when', 'how', 'why', 'paper',
            'study', 'research', 'approach', 'method', 'propose', 'present',
            'show', 'demonstrate', 'results', 'using', 'based', 'novel'
        }
        
        for paper in state['papers']:
            # Extract meaningful phrases from abstract
            text = paper['abstract'].lower()
            
            # Important HCI and AI domain terms (multi-word phrases first)
            domain_terms = [
                # AI/ML terms
                'machine learning', 'deep learning', 'neural network', 'reinforcement learning',
                'transfer learning', 'federated learning', 'large language model', 'generative ai',
                'computer vision', 'natural language processing', 'speech recognition',
                'knowledge graph', 'diffusion model', 'transformer', 'attention mechanism',
                
                # HCI terms
                'user interface', 'user experience', 'interaction design', 'usability',
                'accessibility', 'human-computer interaction', 'user study', 'user behavior',
                'augmented reality', 'virtual reality', 'mixed reality', 'extended reality',
                'gesture recognition', 'eye tracking', 'haptic feedback', 'multimodal interaction',
                
                # Application domains
                'healthcare', 'education', 'robotics', 'autonomous systems', 'iot',
                'cybersecurity', 'privacy', 'explainability', 'interpretability', 'fairness',
                'bias', 'ethics', 'sustainability', 'accessibility'
            ]
            
            # Extract domain terms found in abstract
            extracted_terms = set()
            for term in domain_terms:
                if term in text:
                    extracted_terms.add(term)
            
            # Extract significant single words (nouns, adjectives, verbs)
            words = text.replace(',', ' ').replace('.', ' ').replace('(', ' ').replace(')', ' ').split()
            word_freq = {}
            
            for word in words:
                word = word.strip()
                # Keep words that are 4+ chars, not stop words, and alphanumeric
                if len(word) >= 4 and word not in stop_words and word.isalpha():
                    word_freq[word] = word_freq.get(word, 0) + 1
            
            # Get top single-word keywords (frequency > 1)
            for word, freq in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]:
                if freq > 1:  # Only words appearing multiple times
                    extracted_terms.add(word)
            
            # Store extracted keywords
            for term in extracted_terms:
                keyword_data = {
                    'paper_id': paper['id'],
                    'keyword': term,
                    'source': 'nlp_extracted',
                    'confidence': 0.9,
                    'category': 'topic'
                }
                keyword = Keyword(**keyword_data)
                db.add(keyword)
                keywords.append(keyword_data)
        
        db.commit()
        db.close()
        
        state['keywords'] = keywords
        state['current_step'] = 'keywords_extracted'
        print(f"✅ Keyword Extraction Agent: Extracted {len(keywords)} keywords")
        
    except Exception as e:
        print(f"❌ Keyword Extraction Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

def trend_analysis_agent(state: AgentState) -> AgentState:
    """
    Agent 3: Calculate trending keywords
    """
    print("📊 Trend Analysis Agent: Calculating trends...")
    
    try:
        db = SessionLocal()
        
        # Get current week start
        today = datetime.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        # Count keyword frequencies for this week
        keyword_counts = {}
        for keyword in state['keywords']:
            kw = keyword['keyword']
            keyword_counts[kw] = keyword_counts.get(kw, 0) + 1
        
        # Calculate trending scores
        trends_data = {}
        for keyword, frequency in keyword_counts.items():
            # Simple trending score: frequency * recency weight
            trending_score = frequency * 1.5  # Boost new items
            
            # Get historical data
            historical = db.query(Trend).filter(
                Trend.keyword == keyword,
                Trend.week_start < week_start
            ).order_by(Trend.week_start.desc()).first()
            
            growth_rate = 0.0
            if historical:
                if historical.frequency > 0:
                    growth_rate = ((frequency - historical.frequency) / historical.frequency) * 100
            
            # Store trend
            trend = Trend(
                keyword=keyword,
                week_start=week_start,
                frequency=frequency,
                trending_score=trending_score,
                growth_rate=growth_rate
            )
            db.add(trend)
            
            trends_data[keyword] = {
                'frequency': frequency,
                'trending_score': trending_score,
                'growth_rate': growth_rate
            }
        
        db.commit()
        db.close()
        
        state['trends'] = trends_data
        state['current_step'] = 'trends_calculated'
        print(f"✅ Trend Analysis Agent: Calculated {len(trends_data)} trends")
        
    except Exception as e:
        print(f"❌ Trend Analysis Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

def summary_generation_agent(state: AgentState) -> AgentState:
    """
    Agent 4: Generate student-friendly summaries using Grok API
    """
    print("📝 Summary Generation Agent: Creating summaries...")
    
    try:
        db = SessionLocal()
        summaries = []
        
        if not config.GROK_API_KEY:
            print("⚠️  Warning: GROK_API_KEY not set, skipping summary generation")
            state['summaries'] = []
            state['current_step'] = 'summaries_generated'
            return state
        
        headers = {
            "Authorization": f"Bearer {config.GROK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        for paper in state['papers'][:5]:  # Limit to 5 papers to save API calls
            prompt = f"""
            Summarize this research paper for undergraduate students in exactly 100 words.
            Make it accessible, exciting, and easy to understand.
            
            Title: {paper['title']}
            Abstract: {paper['abstract']}
            
            Summary:
            """
            
            # Try up to 3 times with longer timeout
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = requests.post(
                        f"{config.GROK_API_BASE_URL}/chat/completions",
                        headers=headers,
                        json={
                            "model": config.GROK_MODEL_TEXT,
                            "messages": [
                                {"role": "system", "content": "You are a helpful assistant that explains research to students."},
                                {"role": "user", "content": prompt}
                            ],
                            "max_tokens": 200,
                            "temperature": 0.7
                        },
                        timeout=60  # Increased to 60 seconds
                    )
                    
                    if response.status_code == 200:
                        summary_text = response.json()['choices'][0]['message']['content']
                        word_count = len(summary_text.split())
                        
                        summary = Summary(
                            paper_id=paper['id'],
                            summary_text=summary_text,
                            word_count=word_count,
                            difficulty_level='undergraduate'
                        )
                        db.add(summary)
                        db.commit()
                        
                        summaries.append({
                            'paper_id': paper['id'],
                            'summary_text': summary_text,
                            'word_count': word_count
                        })
                        print(f"✅ Generated summary for paper {paper['arxiv_id']}")
                        break  # Success, exit retry loop
                    else:
                        print(f"⚠️  API returned status {response.status_code} for paper {paper['arxiv_id']}")
                        if attempt < max_retries - 1:
                            print(f"   Retrying... ({attempt + 2}/{max_retries})")
                            continue
                        
                except Exception as e:
                    print(f"⚠️  Error generating summary for paper {paper['arxiv_id']}: {str(e)}")
                    if attempt < max_retries - 1:
                        print(f"   Retrying... ({attempt + 2}/{max_retries})")
                        continue
                    else:
                        print(f"   Failed after {max_retries} attempts, skipping...")
                        break
        
        db.close()
        
        state['summaries'] = summaries
        state['current_step'] = 'summaries_generated'
        print(f"✅ Summary Generation Agent: Created {len(summaries)} summaries")
        
    except Exception as e:
        print(f"❌ Summary Generation Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

def image_creation_agent(state: AgentState) -> AgentState:
    """
    Agent 5: Generate images using Grok-2-Image-1212
    """
    print("🎨 Image Creation Agent: Generating images...")
    
    try:
        images = []
        
        if not config.GROK_API_KEY:
            print("⚠️  Warning: GROK_API_KEY not set, skipping image generation")
            state['images'] = []
            state['current_step'] = 'images_created'
            return state
        
        # For now, we'll skip actual image generation to save costs
        # In production, you would call Grok-2-Image-1212 API here
        print("ℹ️  Image generation prepared (implement Grok-2-Image-1212 API call)")
        
        state['images'] = images
        state['current_step'] = 'images_created'
        print(f"✅ Image Creation Agent: Prepared {len(images)} image requests")
        
    except Exception as e:
        print(f"❌ Image Creation Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

def report_generation_agent(state: AgentState) -> AgentState:
    """
    Agent 6: Build weekly markdown reports
    """
    print("📄 Report Generation Agent: Building reports...")
    
    try:
        report_lines = []
        report_lines.append(f"# HCI Research Trends Report")
        report_lines.append(f"**Week of {datetime.now().strftime('%B %d, %Y')}**\n")
        
        # Papers section
        report_lines.append(f"## 📚 New Papers ({len(state['papers'])})")
        for paper in state['papers'][:10]:
            report_lines.append(f"\n### {paper['title']}")
            report_lines.append(f"**Authors:** {', '.join(paper['authors'][:3])}")
            report_lines.append(f"**Categories:** {', '.join(paper['categories'])}")
            report_lines.append(f"**ArXiv:** {paper['arxiv_url']}\n")
        
        # Trends section
        report_lines.append(f"\n## 📊 Trending Topics")
        if state['trends']:
            sorted_trends = sorted(
                state['trends'].items(),
                key=lambda x: x[1]['trending_score'],
                reverse=True
            )[:10]
            
            for keyword, data in sorted_trends:
                report_lines.append(
                    f"- **{keyword}**: {data['frequency']} papers "
                    f"(score: {data['trending_score']:.1f}, "
                    f"growth: {data['growth_rate']:.1f}%)"
                )
        
        report = "\n".join(report_lines)
        
        state['reports'] = [report]
        state['current_step'] = 'reports_built'
        print("✅ Report Generation Agent: Report created")
        
    except Exception as e:
        print(f"❌ Report Generation Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

def social_media_agent(state: AgentState) -> AgentState:
    """
    Agent 7: Create social media posts
    """
    print("📱 Social Media Agent: Creating posts...")
    
    try:
        posts = []
        
        for paper in state['papers'][:5]:  # Top 5 papers
            post = {
                'platform': 'twitter',
                'content': f"🔬 New HCI Research:\n\n{paper['title'][:100]}...\n\n"
                          f"📖 Read more: {paper['arxiv_url']}\n\n"
                          f"#HCI #Research #SIGCHIUC",
                'paper_id': paper['id']
            }
            posts.append(post)
        
        state['social_posts'] = posts
        state['current_step'] = 'social_posts_created'
        print(f"✅ Social Media Agent: Created {len(posts)} posts")
        
    except Exception as e:
        print(f"❌ Social Media Agent Error: {str(e)}")
        state['error'] = str(e)
    
    return state

# Create the workflow
def create_workflow() -> StateGraph:
    """
    Create and configure the LangGraph workflow
    """
    workflow = StateGraph(AgentState)
    
    # Add all agents
    workflow.add_node("arxiv_searcher", arxiv_search_agent)
    workflow.add_node("keyword_extractor", keyword_extraction_agent)
    workflow.add_node("trend_calculator", trend_analysis_agent)
    workflow.add_node("summarizer", summary_generation_agent)
    workflow.add_node("image_generator", image_creation_agent)
    workflow.add_node("report_builder", report_generation_agent)
    workflow.add_node("social_creator", social_media_agent)
    
    # Define the flow
    workflow.add_edge("arxiv_searcher", "keyword_extractor")
    workflow.add_edge("keyword_extractor", "trend_calculator")
    workflow.add_edge("trend_calculator", "summarizer")
    workflow.add_edge("summarizer", "image_generator")
    workflow.add_edge("image_generator", "report_builder")
    workflow.add_edge("report_builder", "social_creator")
    workflow.add_edge("social_creator", END)
    
    # Set entry point
    workflow.set_entry_point("arxiv_searcher")
    
    return workflow.compile()

# Run the workflow
def run_workflow() -> Dict[str, Any]:
    """
    Execute the complete workflow
    """
    print("🚀 Starting HCI Research Trends Workflow...\n")
    
    initial_state: AgentState = {
        'papers': [],
        'keywords': [],
        'trends': {},
        'summaries': [],
        'images': [],
        'reports': [],
        'social_posts': [],
        'current_step': 'starting',
        'error': None
    }
    
    app = create_workflow()
    result = app.invoke(initial_state)
    
    print("\n✨ Workflow Complete!")
    print(f"Papers found: {len(result['papers'])}")
    print(f"Keywords extracted: {len(result['keywords'])}")
    print(f"Trends calculated: {len(result['trends'])}")
    print(f"Summaries generated: {len(result['summaries'])}")
    print(f"Social posts created: {len(result['social_posts'])}")
    
    return result