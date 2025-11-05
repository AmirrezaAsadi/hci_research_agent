from sqlalchemy import create_engine, Column, Integer, String, Text, Date, TIMESTAMP, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import config

Base = declarative_base()

class Paper(Base):
    __tablename__ = "papers"
    
    id = Column(Integer, primary_key=True, index=True)
    arxiv_id = Column(String(20), unique=True, nullable=False, index=True)
    title = Column(Text, nullable=False)
    authors = Column(JSON, nullable=False)
    abstract = Column(Text, nullable=False)
    arxiv_categories = Column(JSON, nullable=False)
    published_date = Column(Date, nullable=False)
    arxiv_url = Column(String(255), nullable=False)
    pdf_url = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class Keyword(Base):
    __tablename__ = "keywords"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, nullable=False, index=True)
    keyword = Column(String(100), nullable=False, index=True)
    source = Column(String(20), nullable=False)  # 'arxiv' or 'extracted'
    confidence = Column(Float, default=1.0)
    category = Column(String(50))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, nullable=False, index=True)
    summary_text = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=False)
    difficulty_level = Column(String(20))
    generated_image_url = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class Trend(Base):
    __tablename__ = "trends"
    
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String(100), nullable=False, index=True)
    week_start = Column(Date, nullable=False, index=True)
    frequency = Column(Integer, nullable=False)
    trending_score = Column(Float, nullable=False)
    growth_rate = Column(Float)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

# Database connection
engine = create_engine(config.POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()