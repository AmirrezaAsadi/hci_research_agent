# HCI Research Trends Backend

FastAPI backend with LangGraph agents for automated HCI research discovery and analysis.

## 🏗️ Architecture

This backend implements a **7-agent LangGraph workflow**:

1. **ArXiv Search Agent** - Discovers new HCI papers
2. **Keyword Extraction Agent** - Extracts topics and terms
3. **Trend Analysis Agent** - Calculates trending keywords
4. **Summary Generation Agent** - Creates student-friendly summaries (Grok AI)
5. **Image Creation Agent** - Generates visual content (Grok-2-Image)
6. **Report Building Agent** - Creates markdown reports
7. **Social Media Agent** - Prepares social posts

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Configure Database

```bash
# Set your PostgreSQL connection string in .env
DATABASE_URL=postgresql://user:pass@localhost/hci_research
```

### 4. Run the Server

```bash
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --port 8000
```

### 5. Test the API

Visit: http://localhost:8000

```bash
# Health check
curl http://localhost:8000/health

# Trigger workflow
curl -X POST http://localhost:8000/workflow/run \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

## 📡 API Endpoints

### Core Endpoints

- `GET /` - Health check
- `GET /health` - Detailed system status
- `POST /workflow/run` - Trigger the LangGraph workflow

### Data Endpoints

- `GET /papers?limit=20&offset=0` - Get recent papers
- `GET /trends?limit=20` - Get trending keywords
- `GET /summaries/{paper_id}` - Get paper summary
- `GET /stats` - Overall statistics

## 🤖 LangGraph Workflow

The workflow runs automatically and processes papers through all agents:

```
ArXiv Search → Keyword Extraction → Trend Analysis
     ↓
Summary Generation → Image Creation → Report Building → Social Media
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# APIs
GROK_API_KEY=your-key
GROK_API_BASE_URL=https://api.x.ai/v1

# Redis
REDIS_URL=redis://localhost:6379/0

# Frontend
FRONTEND_URL=http://localhost:3000

# Settings
DEBUG=True
PORT=8000
```

## 🚢 Deployment (Railway)

1. Connect GitHub repo to Railway
2. Set root directory to `backend`
3. Add PostgreSQL and Redis services
4. Configure environment variables
5. Deploy!

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Database Schema

### Tables

- **papers** - ArXiv paper metadata
- **keywords** - Extracted keywords and topics
- **summaries** - AI-generated summaries
- **trends** - Keyword trend analysis

## 🧪 Testing

```bash
# Run workflow manually
python -c "from agents import run_workflow; run_workflow()"

# Test individual endpoints
curl http://localhost:8000/papers
curl http://localhost:8000/trends
```

## 📝 Development

### Adding New Agents

1. Define agent function in `agents.py`
2. Add to workflow graph
3. Connect with edges
4. Update state TypedDict

### Modifying Workflow

Edit `agents.py`:

```python
def my_new_agent(state: AgentState) -> AgentState:
    # Your agent logic
    return state

# Add to workflow
workflow.add_node("my_agent", my_new_agent)
workflow.add_edge("previous_agent", "my_agent")
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check connection
psql $DATABASE_URL

# Reset database
python -c "from database import init_db; init_db()"
```

### Grok API Errors

- Verify API key is correct
- Check rate limits
- Workflow continues without summaries if API fails

### ArXiv API Rate Limits

- Max 3 requests per second
- Use built-in delays in agent
- Workflow will retry on failures

## 📦 Dependencies

Key packages:

- `fastapi` - Web framework
- `langgraph` - Agent orchestration
- `langchain` - LLM utilities
- `arxiv` - ArXiv API client
- `sqlalchemy` - Database ORM
- `celery` - Task queue (future)
- `redis` - Caching (future)

## 🔒 Security

- API keys stored in environment variables
- CORS configured for frontend only
- Database credentials never exposed
- Rate limiting on API endpoints (TODO)

## 📈 Monitoring

Check Railway logs for:

- Workflow execution status
- API call counts
- Error rates
- Database query performance

## 🎯 Roadmap

- [ ] Add authentication
- [ ] Implement rate limiting
- [ ] Add webhook notifications
- [ ] Celery task queue
- [ ] Advanced trend algorithms
- [ ] Real-time updates via WebSocket
- [ ] Metrics and monitoring

---

Built with ❤️ for HCI researchers