from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from database import init_db, get_db, SessionLocal, Paper, Keyword, Trend, Summary
from agents import run_workflow
import config

app = FastAPI(title="HCI Research Trends API Made in Cincinnati", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL, "*"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class WorkflowTrigger(BaseModel):
    force: Optional[bool] = False

class StatusResponse(BaseModel):
    status: str
    message: str

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    print("🚀 Starting HCI Research Trends Backend...")
    init_db()
    print("✅ Database initialized")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "HCI Research Trends Backend",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    db = SessionLocal()
    try:
        paper_count = db.query(Paper).count()
        keyword_count = db.query(Keyword).count()
        trend_count = db.query(Trend).count()
        
        return {
            "status": "healthy",
            "database": "connected",
            "papers": paper_count,
            "keywords": keyword_count,
            "trends": trend_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
    finally:
        db.close()

@app.post("/workflow/run", response_model=StatusResponse)
async def trigger_workflow(
    trigger: WorkflowTrigger,
    background_tasks: BackgroundTasks
):
    """
    Trigger the complete LangGraph workflow
    This will:
    1. Search ArXiv for new papers
    2. Extract keywords
    3. Calculate trends
    4. Generate summaries
    5. Create images
    6. Build reports
    7. Create social posts
    """
    def run_in_background():
        try:
            result = run_workflow()
            print(f"✅ Workflow completed successfully")
            print(f"   Papers: {len(result['papers'])}")
            print(f"   Keywords: {len(result['keywords'])}")
            print(f"   Trends: {len(result['trends'])}")
        except Exception as e:
            print(f"❌ Workflow failed: {str(e)}")
    
    background_tasks.add_task(run_in_background)
    
    return StatusResponse(
        status="started",
        message="Workflow started in background. Check logs for progress."
    )

@app.get("/papers")
async def get_papers(limit: int = 20, offset: int = 0):
    """Get recent papers"""
    db = SessionLocal()
    try:
        papers = db.query(Paper).order_by(Paper.published_date.desc()).offset(offset).limit(limit).all()
        return {
            "success": True,
            "data": [
                {
                    "id": p.id,
                    "arxiv_id": p.arxiv_id,
                    "title": p.title,
                    "authors": p.authors,
                    "abstract": p.abstract,
                    "arxiv_categories": p.arxiv_categories,
                    "published_date": p.published_date.isoformat(),
                    "arxiv_url": p.arxiv_url,
                    "pdf_url": p.pdf_url
                }
                for p in papers
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/trends")
async def get_trends(limit: int = 20):
    """Get trending keywords"""
    db = SessionLocal()
    try:
        trends = db.query(Trend).order_by(Trend.trending_score.desc()).limit(limit).all()
        return {
            "success": True,
            "data": [
                {
                    "id": t.id,
                    "keyword": t.keyword,
                    "week_start": t.week_start.isoformat(),
                    "frequency": t.frequency,
                    "trending_score": t.trending_score,
                    "growth_rate": t.growth_rate
                }
                for t in trends
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/summaries/{paper_id}")
async def get_summary(paper_id: int):
    """Get summary for a specific paper"""
    db = SessionLocal()
    try:
        summary = db.query(Summary).filter(Summary.paper_id == paper_id).first()
        if not summary:
            raise HTTPException(status_code=404, detail="Summary not found")
        
        return {
            "success": True,
            "data": {
                "paper_id": summary.paper_id,
                "summary_text": summary.summary_text,
                "word_count": summary.word_count,
                "difficulty_level": summary.difficulty_level,
                "generated_image_url": summary.generated_image_url
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/stats")
async def get_stats():
    """Get database statistics"""
    db = SessionLocal()
    try:
        paper_count = db.query(Paper).count()
        keyword_count = db.query(Keyword).count()
        trend_count = db.query(Trend).count()
        summary_count = db.query(Summary).count()
        summaries_with_images = db.query(Summary).filter(Summary.generated_image_url != None).count()
        
        return {
            "success": True,
            "data": {
                "total_papers": paper_count,
                "total_keywords": keyword_count,
                "total_trends": trend_count,
                "total_summaries": summary_count,
                "summaries_with_images": summaries_with_images
            }
        }
    finally:
        db.close()

@app.get("/test-image")
async def test_image_generation():
    """Test image generation with Grok API"""
    import requests
    
    if not config.GROK_API_KEY:
        return {"error": "GROK_API_KEY not set"}
    
    headers = {
        "Authorization": f"Bearer {config.GROK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    test_prompt = "A simple, modern, minimalist illustration of AI and human interaction"
    
    try:
        # Test with chat completions endpoint
        response = requests.post(
            f"{config.GROK_API_BASE_URL}/chat/completions",
            headers=headers,
            json={
                "model": config.GROK_MODEL_IMAGE,
                "messages": [
                    {"role": "user", "content": test_prompt}
                ],
                "temperature": 0.7
            },
            timeout=30
        )
        
        return {
            "status_code": response.status_code,
            "response": response.json() if response.status_code == 200 else response.text,
            "model": config.GROK_MODEL_IMAGE
        }
    except Exception as e:
        return {
            "error": str(e),
            "model": config.GROK_MODEL_IMAGE
        }

@app.post("/reset", response_model=StatusResponse)
async def reset_database():
    """
    Reset the database - delete all papers, keywords, summaries, and trends
    WARNING: This will delete all data!
    """
    db = SessionLocal()
    try:
        # Delete in correct order (foreign keys)
        summary_count = db.query(Summary).count()
        db.query(Summary).delete()
        
        keyword_count = db.query(Keyword).count()
        db.query(Keyword).delete()
        
        trend_count = db.query(Trend).count()
        db.query(Trend).delete()
        
        paper_count = db.query(Paper).count()
        db.query(Paper).delete()
        
        db.commit()
        
        return StatusResponse(
            status="success",
            message=f"Database reset! Deleted {paper_count} papers, {keyword_count} keywords, {summary_count} summaries, {trend_count} trends"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=config.DEBUG
    )