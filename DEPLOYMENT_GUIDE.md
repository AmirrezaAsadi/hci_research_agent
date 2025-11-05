# 🚀 Complete Deployment Guide - HCI Research Trends Platform

This guide will walk you through deploying the full HCI Research Trends Platform with LangGraph agents, Grok AI, Vercel (frontend), and Railway (backend).

## 📋 Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   Frontend          │         │   Backend            │         │   External APIs │
│   (Vercel)          │◄───────►│   (Railway)          │◄───────►│                 │
│                     │         │                      │         │   • ArXiv API   │
│   • Next.js 16      │         │   • FastAPI          │         │   • Grok API    │
│   • React UI        │         │   • LangGraph Agents │         │   • Grok Images │
│   • Vercel Postgres │         │   • PostgreSQL       │         │                 │
│   • Search/Display  │         │   • Redis            │         └─────────────────┘
└─────────────────────┘         └──────────────────────┘
```

## 🎯 What You'll Need

### 1. **Accounts**
- ✅ GitHub account
- ✅ Vercel account (free tier)
- ✅ Railway account (free trial $5 credit)
- ✅ Grok API key from X.AI (for AI features)

### 2. **Services**
- Vercel: Frontend hosting + Postgres database
- Railway: Backend hosting + PostgreSQL + Redis

---

## 📦 Part 1: Backend Deployment (Railway)

### Step 1: Prepare Backend Repository

1. **Commit backend code to GitHub:**
```bash
cd /Users/amir/Downloads/repos/hci_research_agent
git add backend/
git commit -m "Add backend with LangGraph agents"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `hci_research_agent` repository
6. Railway will detect the backend

### Step 3: Configure Railway Services

#### A. PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Copy the **DATABASE_URL** from the **"Connect"** tab

#### B. Redis Cache

1. Click **"+ New"** again
2. Select **"Database"** → **"Redis"**
3. Railway will create a Redis instance
4. Copy the **REDIS_URL** from the **"Connect"** tab

#### C. Backend Service

1. Click on your backend service
2. Go to **"Settings"** → **"Root Directory"**
3. Set root directory to: `backend`
4. Go to **"Variables"** and add:

```bash
# Database (from PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (from Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# Grok API Key (get from console.x.ai)
GROK_API_KEY=your-grok-api-key-here
GROK_API_BASE_URL=https://api.x.ai/v1

# Frontend URL (add after Vercel deployment)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Settings
DEBUG=False
PORT=8000
```

5. Click **"Deploy"**

### Step 4: Get Grok API Key

1. Go to [console.x.ai](https://console.x.ai/)
2. Sign up for an account
3. Go to **"API Keys"**
4. Create a new API key
5. Copy the key and add it to Railway environment variables

### Step 5: Verify Backend Deployment

1. Wait for Railway to deploy (2-3 minutes)
2. Click **"View Logs"** to see deployment progress
3. Once deployed, click the **domain** Railway assigns
4. You should see: `{"status":"running","service":"HCI Research Trends Backend","version":"1.0.0"}`

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

1. **Update `.env.local.example` with your Railway URL:**

```bash
# Backend API URL (from Railway)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Vercel Postgres
POSTGRES_URL=your-vercel-postgres-url
```

2. **Commit changes:**
```bash
git add .
git commit -m "Configure frontend for Railway backend"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your `hci_research_agent` repository
4. Vercel auto-detects Next.js
5. Click **"Deploy"**

### Step 3: Set Up Vercel Postgres

1. In Vercel project dashboard, go to **"Storage"**
2. Click **"Create Database"** → **"Postgres"**
3. Name it `hci-research-db`
4. Select your preferred region
5. Click **"Create"**

### Step 4: Configure Environment Variables

1. Go to **"Settings"** → **"Environment Variables"**
2. Add these variables:

```bash
# Backend URL (from Railway)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Vercel Postgres (auto-filled from database)
POSTGRES_URL=postgresql://...
```

3. Click **"Save"**
4. Redeploy: **"Deployments"** → Latest → **"Redeploy"**

### Step 5: Update Railway with Vercel URL

1. Go back to Railway
2. Update **FRONTEND_URL** environment variable:
```bash
FRONTEND_URL=https://your-project.vercel.app
```
3. Redeploy the backend

---

## 🔧 Part 3: Testing & Running the Workflow

### Step 1: Trigger the Workflow

You can trigger the workflow in three ways:

#### Option 1: Via Railway Dashboard
1. Go to Railway → Your Backend Service → **Logs**
2. Run a manual test by calling the API endpoint

#### Option 2: Via API Call
```bash
curl -X POST https://your-backend.railway.app/workflow/run \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

#### Option 3: Add Admin Button to Frontend
Create a simple admin page to trigger workflows (optional).

### Step 2: Verify Workflow Execution

1. **Check Railway Logs:**
   - Go to Railway → Backend Service → **Logs**
   - You should see:
     ```
     🚀 Starting HCI Research Trends Workflow...
     🔍 ArXiv Search Agent: Starting paper search...
     ✅ ArXiv Search Agent: Found X new papers
     🔑 Keyword Extraction Agent: Extracting keywords...
     ... etc
     ```

2. **Check Database:**
   - Visit: `https://your-backend.railway.app/health`
   - Should show paper counts, keyword counts, etc.

3. **Check Frontend:**
   - Visit your Vercel URL
   - Papers should appear on homepage
   - Trends should show in dashboard

---

## 📊 Part 4: Scheduling (Automation)

### Option A: Railway Cron Jobs

1. In Railway, go to your backend service
2. Add a **Cron Job** service
3. Schedule: `0 9 * * *` (daily at 9 AM UTC)
4. Command: `curl -X POST http://localhost:8000/workflow/run`

### Option B: Vercel Cron (Simple)

1. Create `app/api/cron/route.ts`:
```typescript
export async function GET() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workflow/run`,
    { method: 'POST' }
  );
  return Response.json(await response.json());
}
```

2. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 🎉 Part 5: Verification Checklist

### ✅ Backend (Railway)
- [ ] PostgreSQL database created
- [ ] Redis instance created
- [ ] Backend deployed successfully
- [ ] Environment variables set
- [ ] `/health` endpoint returns data
- [ ] Grok API key added

### ✅ Frontend (Vercel)
- [ ] Vercel Postgres created
- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] Can see Railway backend URL configured
- [ ] Homepage loads without errors

### ✅ Integration
- [ ] Frontend can call backend API
- [ ] Workflow can be triggered
- [ ] Papers appear in database
- [ ] Trends calculate correctly
- [ ] Summaries generate (if Grok API configured)

---

## 🔑 Environment Variables Summary

### Railway Backend
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
GROK_API_KEY=xai-xxx
GROK_API_BASE_URL=https://api.x.ai/v1
FRONTEND_URL=https://your-app.vercel.app
DEBUG=False
PORT=8000
```

### Vercel Frontend
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
POSTGRES_URL=postgresql://...
```

---

## 📝 Part 6: First Run Instructions

### Step 1: Initial Data Population

1. **Trigger the workflow for the first time:**
```bash
curl -X POST https://your-backend.railway.app/workflow/run \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

2. **Watch the logs in Railway:**
   - The workflow will:
     - Search ArXiv for HCI papers (last 7 days)
     - Extract keywords from papers
     - Calculate trending topics
     - Generate AI summaries (if Grok API configured)
     - Create reports

3. **Check results:**
   - Visit: `https://your-vercel-app.vercel.app`
   - You should see papers and trends!

---

## 🐛 Troubleshooting

### Problem: Backend won't start
**Solution:**
- Check Railway logs for errors
- Verify `DATABASE_URL` is set
- Ensure `backend/` is set as root directory

### Problem: Frontend can't connect to backend
**Solution:**
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify CORS is enabled in backend
- Test backend health: `https://your-backend.railway.app/health`

### Problem: No papers appearing
**Solution:**
- Trigger workflow manually
- Check Railway logs for errors
- Verify ArXiv API is accessible

### Problem: Grok API errors
**Solution:**
- Verify API key is correct
- Check API quota/limits
- Workflow will continue without summaries if Grok fails

---

## 💰 Cost Estimation

### Free Tier Limits:
- **Railway**: $5 credit (covers ~2-3 months light usage)
- **Vercel**: Free for hobby projects
- **Grok API**: Pay-per-use (varies)

### Monthly Estimate:
- Railway: $5-10 (PostgreSQL + Redis + Compute)
- Vercel: $0 (free tier sufficient)
- Grok API: $1-5 (depends on usage)

**Total: ~$6-15/month**

---

## 🚀 Next Steps

After deployment, you can:

1. **Enable Daily Automation**
   - Set up cron jobs for daily paper updates

2. **Add Social Media Integration**
   - Connect Twitter/LinkedIn APIs for posting

3. **Enhance AI Features**
   - Add image generation with Grok-2-Image-1212
   - Improve summary quality

4. **Add User Features**
   - User accounts
   - Favorite papers
   - Email notifications

5. **Analytics**
   - Track popular papers
   - Monitor trending topics
   - User engagement metrics

---

## 📚 Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **LangGraph Docs**: https://python.langchain.com/docs/langgraph
- **Grok API**: https://console.x.ai/
- **ArXiv API**: https://info.arxiv.org/help/api/

---

## 🎯 Quick Start Checklist

1. [ ] Sign up for Railway, Vercel, X.AI
2. [ ] Deploy backend to Railway with PostgreSQL + Redis
3. [ ] Get Grok API key from console.x.ai
4. [ ] Deploy frontend to Vercel with Postgres
5. [ ] Configure environment variables on both platforms
6. [ ] Trigger first workflow run
7. [ ] Verify papers appear on frontend
8. [ ] Set up cron job for daily updates
9. [ ] 🎉 Done!

---

**Need help?** Check the troubleshooting section or open an issue on GitHub!

Good luck with your deployment! 🚀