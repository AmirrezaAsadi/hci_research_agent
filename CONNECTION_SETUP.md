# 🔗 Connection Setup Guide

Since your frontend is already on Vercel, let's connect it to:
1. ✅ Vercel Database (Postgres)
2. ✅ Railway (Backend with LangGraph)
3. ✅ Grok API (AI Features)

---

## 📋 Step 1: Connect Vercel Postgres Database

### A. Create Database in Vercel

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your `hci_research_agent` project

2. **Navigate to Storage tab**
   - Click **"Storage"** in the sidebar
   - Click **"Create Database"**
   - Select **"Postgres"**

3. **Configure database**
   - **Name**: `hci-research-db`
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - Click **"Create"**

4. **Copy connection string**
   - After creation, go to **".env.local"** tab
   - Copy the `POSTGRES_URL` value
   - It looks like: `postgres://default:xxxxx@xxx-pooler.aws.com:5432/verceldb`

### B. Add to Vercel Environment Variables

1. **In your Vercel project:**
   - Go to **"Settings"** → **"Environment Variables"**

2. **Add the database URL:**
   ```
   POSTGRES_URL=postgres://default:xxxxx@xxx-pooler.aws.com:5432/verceldb
   ```
   - Select: **Production**, **Preview**, **Development**
   - Click **"Save"**

3. **Redeploy** (automatic after saving env vars)

### C. Initialize Database Tables

The tables will be created automatically when you first call the `/api/papers` endpoint. But you can also create them manually:

1. Go to Vercel dashboard → Storage → Your Postgres DB
2. Click **"Query"** tab
3. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS papers (
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

CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER REFERENCES papers(id),
    keyword VARCHAR(100) NOT NULL,
    source VARCHAR(20) NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS summaries (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER REFERENCES papers(id),
    summary_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    difficulty_level VARCHAR(20),
    generated_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trends (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    week_start DATE NOT NULL,
    frequency INTEGER NOT NULL,
    trending_score FLOAT NOT NULL,
    growth_rate FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

✅ **Vercel Postgres is now connected!**

---

## 🚂 Step 2: Deploy Backend to Railway

### A. Sign Up for Railway

1. Go to https://railway.app
2. Click **"Login"** → Sign in with GitHub
3. You get **$5 free credit** to start

### B. Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `hci_research_agent` repository
4. Railway will detect it's a monorepo

### C. Configure Backend Service

1. **Set Root Directory:**
   - Click on the service
   - Go to **"Settings"**
   - Under **"Root Directory"**, enter: `backend`
   - Click **"Save"**

2. **Add PostgreSQL Database:**
   - In your Railway project, click **"+ New"**
   - Select **"Database"** → **"Add PostgreSQL"**
   - Railway creates a PostgreSQL instance
   - It will auto-connect to your service

3. **Add Redis (Optional but recommended):**
   - Click **"+ New"** again
   - Select **"Database"** → **"Add Redis"**
   - Railway creates a Redis instance

### D. Configure Environment Variables

1. **Click on your backend service**
2. **Go to "Variables" tab**
3. **Add these variables:**

```bash
# Database (Railway auto-provides this)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (if you added it)
REDIS_URL=${{Redis.REDIS_URL}}

# Grok API (add after Step 3)
GROK_API_KEY=your-key-here
GROK_API_BASE_URL=https://api.x.ai/v1

# Frontend URL (your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Settings
DEBUG=False
PORT=8000
```

4. **Click "Save"** - Railway will automatically redeploy

### E. Get Railway Backend URL

1. **After deployment completes** (2-3 minutes):
   - Click on your backend service
   - Look for **"Domains"** section
   - Railway assigns a URL like: `your-backend.up.railway.app`
   - Copy this URL

✅ **Railway backend is now deployed!**

---

## 🤖 Step 3: Get Grok API Key

### A. Sign Up for Grok API

1. Go to https://console.x.ai/
2. Click **"Sign Up"** or **"Login"**
3. Complete the registration

### B. Create API Key

1. **Go to API Keys section:**
   - Navigate to https://console.x.ai/
   - Click **"API Keys"** in the sidebar

2. **Create new key:**
   - Click **"Create API Key"**
   - Name it: `HCI Research Platform`
   - Copy the key immediately (shown only once!)
   - It looks like: `xai-xxxxxxxxxxxxxxxxxxxxxxxx`

### C. Add to Railway

1. **Go back to Railway**
2. **Your backend service → Variables**
3. **Update/Add:**
   ```
   GROK_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Save** - Railway redeploys

### D. Pricing Information

- Grok API is **pay-per-use**
- Text generation: ~$0.50 per 1M tokens
- Image generation: ~$0.08 per image
- You'll need to add payment method in X.AI console

✅ **Grok API is now connected!**

---

## 🔗 Step 4: Connect Frontend to Backend

### A. Add Backend URL to Vercel

1. **Go to your Vercel project**
2. **Settings → Environment Variables**
3. **Add this variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```
   - Replace with your Railway URL from Step 2E
   - Select: **Production**, **Preview**, **Development**
   - Click **"Save"**

### B. Update Railway with Vercel URL

1. **Go to Railway → Your backend service → Variables**
2. **Update FRONTEND_URL:**
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   - Replace with your actual Vercel URL
   - Click **"Save"**

### C. Redeploy Both

1. **Vercel**: Automatic after env var change
2. **Railway**: Automatic after env var change

Wait 2-3 minutes for both to redeploy.

✅ **Frontend and Backend are now connected!**

---

## ✅ Step 5: Verify Everything Works

### A. Test Backend Health

1. **Open your browser**
2. **Go to:** `https://your-backend.up.railway.app/health`
3. **You should see:**
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "papers": 0,
     "keywords": 0,
     "trends": 0
   }
   ```

### B. Test Frontend

1. **Go to your Vercel URL:** `https://your-app.vercel.app`
2. **Homepage should load** without errors
3. **Check browser console** (F12) for any errors

### C. Trigger First Workflow

**Option 1: Using curl**
```bash
curl -X POST https://your-backend.up.railway.app/workflow/run \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

**Option 2: Using browser**
- Go to: `https://your-backend.up.railway.app/docs`
- Click on `/workflow/run` endpoint
- Click **"Try it out"**
- Click **"Execute"**

**Option 3: Create admin page** (optional, see below)

### D. Watch Railway Logs

1. **Go to Railway → Your backend service**
2. **Click "Logs" tab**
3. **You should see:**
   ```
   🚀 Starting HCI Research Trends Workflow...
   🔍 ArXiv Search Agent: Starting paper search...
   ✅ ArXiv Search Agent: Found X new papers
   🔑 Keyword Extraction Agent: Extracting keywords...
   📊 Trend Analysis Agent: Calculating trends...
   📝 Summary Generation Agent: Creating summaries...
   ... etc
   ```

### E. Check Results

1. **Refresh your Vercel frontend**
2. **Papers should appear** on homepage
3. **Trends should show** in charts
4. **Search should work**

✅ **Everything is connected and working!**

---

## 📊 Step 6: Monitor & Maintain

### Daily Checks

1. **Railway Dashboard:**
   - Check logs for errors
   - Monitor database size
   - Watch credit usage

2. **Vercel Dashboard:**
   - Check deployment status
   - Monitor function executions
   - Review analytics

### Set Up Cron Jobs (Automated Daily Updates)

**Add to `vercel.json`:**
```json
{
  "crons": [{
    "path": "/api/workflow",
    "schedule": "0 9 * * *"
  }]
}
```

This triggers the workflow daily at 9 AM UTC.

---

## 🎯 Quick Reference

### Your URLs

```bash
# Frontend (Vercel)
https://your-app.vercel.app

# Backend (Railway)  
https://your-backend.up.railway.app

# Backend API Docs
https://your-backend.up.railway.app/docs

# Backend Health Check
https://your-backend.up.railway.app/health
```

### Environment Variables

**Vercel (Frontend):**
```bash
POSTGRES_URL=postgres://default:xxxxx@xxx.aws.com:5432/verceldb
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

**Railway (Backend):**
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
GROK_API_KEY=xai-xxxxx
GROK_API_BASE_URL=https://api.x.ai/v1
FRONTEND_URL=https://your-app.vercel.app
DEBUG=False
PORT=8000
```

---

## 💰 Cost Summary

### Monthly Costs:
- **Vercel:** $0 (Free tier)
- **Railway:** $5-10 (after free credit)
- **Grok API:** $1-5 (usage-based)

**Total: ~$6-15/month**

### Free Tiers:
- Vercel: 100GB bandwidth, unlimited projects
- Railway: $5 credit (2-3 months light usage)
- Grok: Pay per use, no minimum

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify Railway backend is running
3. Test: `curl https://your-backend.up.railway.app/health`

### Issue: "Database connection failed"

**Solution:**
1. Check Railway logs for database errors
2. Verify `DATABASE_URL` is set correctly
3. Ensure PostgreSQL service is running

### Issue: "Grok API errors"

**Solution:**
1. Verify API key is correct
2. Check X.AI console for quota
3. Add payment method if needed
4. Workflow continues without summaries if API fails

### Issue: "No papers appearing"

**Solution:**
1. Trigger workflow manually (see Step 5C)
2. Check Railway logs for errors
3. Verify ArXiv API is accessible
4. Wait 5-10 minutes for first run

---

## 🎉 You're All Set!

Your HCI Research Trends Platform is now:
- ✅ Deployed on Vercel
- ✅ Connected to Vercel Postgres
- ✅ Connected to Railway backend
- ✅ Connected to Grok API
- ✅ Running LangGraph agents
- ✅ Ready for automation

### Next: Trigger your first workflow and watch the magic happen! 🚀

---

**Need help?** Check Railway logs and Vercel function logs for detailed error messages.