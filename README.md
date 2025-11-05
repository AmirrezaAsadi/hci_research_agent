# HCI Research Trends Platform

A platform for the ACM SIGCHI UC Student Chapter that automatically discovers HCI research trends, generates student-friendly content, and creates engaging social media posts.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel account with Postgres database

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/your-username/hci-research-trends.git
   cd hci-research-trends
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Vercel Postgres connection string:
   ```
   POSTGRES_URL=your-vercel-postgres-connection-string
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

### Database Setup

The application uses Vercel Postgres. To set up the database:

1. Go to your Vercel dashboard
2. Navigate to your project → Storage → Postgres
3. Create a new database or use existing one
4. Copy the connection string to your environment variables

The database tables will be created automatically when you first run the application.

## 📋 Features

- **Automated ArXiv Search**: Daily discovery of HCI papers
- **Research Paper Database**: Store and search through papers
- **Trend Analysis**: Track keyword popularity over time
- **Search Functionality**: Find papers by title, author, or keywords
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🏗️ Architecture

### Frontend (Next.js + Vercel)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel

### Backend (Vercel Functions)
- **API Routes**: Serverless functions for data operations
- **Database**: Vercel Postgres
- **External APIs**: ArXiv API integration

### Database Schema
- `papers`: Research paper metadata
- `keywords`: Extracted keywords from papers
- `summaries`: AI-generated summaries (future)
- `trends`: Keyword trend analysis (future)

## 🚀 Deployment to Vercel

### Step 1: Connect Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository

### Step 2: Configure Environment Variables
In your Vercel project settings, add:

```
POSTGRES_URL=your-vercel-postgres-connection-string
```

### Step 3: Set Up Database
1. In Vercel dashboard, go to Storage → Postgres
2. Create a database (if not already created)
3. The tables will be created automatically on first run

### Step 4: Deploy
1. Vercel will automatically deploy your application
2. The build process will create the database tables
3. Your site will be live at `your-project.vercel.app`

### Step 5: Populate Data (Optional)
To populate the database with papers:

1. Go to your deployed site
2. The API endpoints are available at `/api/arxiv`
3. You can call this endpoint to fetch papers from ArXiv

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── arxiv/          # ArXiv search endpoint
│   │   ├── papers/         # Papers API
│   │   ├── search/         # Search API
│   │   └── trends/         # Trends API
│   ├── about/              # About page
│   ├── papers/             # Papers listing page
│   ├── search/             # Search page
│   ├── trends/             # Trends page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── lib/
│   └── db.ts               # Database utilities
├── public/                 # Static assets
├── vercel.json             # Vercel configuration
└── package.json
```

## 🔧 API Endpoints

### GET `/api/papers`
Returns recent research papers
- Query params: `limit` (default: 20)

### GET `/api/trends`
Returns trending keywords
- Query params: `limit` (default: 20)

### GET `/api/search`
Search papers by query
- Query params: `q` (search query)

### POST `/api/arxiv`
Fetch new papers from ArXiv
- Body: `{ "maxResults": 20 }`

## 🎯 What You Need to Set Up

### 1. Vercel Account & Project
- Create Vercel account
- Connect your GitHub repository
- Deploy the project

### 2. Vercel Postgres Database
- Enable Postgres in your Vercel project
- Copy the connection string to environment variables
- Database tables are created automatically

### 3. Environment Variables
In Vercel project settings → Environment Variables:
```
POSTGRES_URL=postgresql://...
```

### 4. Domain (Optional)
- Vercel provides a default domain
- You can add a custom domain if needed

## 🔮 Future Enhancements

The platform is designed to be extensible. Future features include:

- **AI Summaries**: Generate student-friendly paper summaries
- **Image Generation**: Create visual illustrations for papers
- **Social Media**: Automated posting to Twitter/LinkedIn
- **Advanced Trends**: Weekly trend reports and predictions
- **User Accounts**: Save favorite papers and get recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is part of the SIGCHI UC Student Chapter initiatives.

---

Built with ❤️ for HCI students by SIGCHI UC
