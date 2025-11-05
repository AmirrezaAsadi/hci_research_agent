import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL")
POSTGRES_URL = os.getenv("POSTGRES_URL", DATABASE_URL)

# API Keys
GROK_API_KEY = os.getenv("GROK_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ArXiv Settings
ARXIV_CATEGORIES = ["cs.HC", "cs.AI", "cs.CY", "cs.CV", "cs.LG"]
ARXIV_MAX_RESULTS = 50
ARXIV_DAYS_BACK = 7

# Grok API Settings
GROK_API_BASE_URL = os.getenv("GROK_API_BASE_URL", "https://api.x.ai/v1")
GROK_MODEL_TEXT = "grok-3-mini"
GROK_MODEL_IMAGE = "grok-2-image-1212"

# Scheduling
SCHEDULE_DAILY_HOUR = 9  # 9 AM UTC
SCHEDULE_WEEKLY_DAY = 6  # Sunday
SCHEDULE_WEEKLY_HOUR = 10  # 10 AM UTC

# App Settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
PORT = int(os.getenv("PORT", 8000))