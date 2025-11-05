#!/bin/bash

# HCI Research Agent - Quick Setup Script
echo "🚀 HCI Research Agent - Database Setup"
echo "======================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "📋 Steps to fix:"
    echo "1. Go to Vercel Dashboard → Your Project → Storage → Neon Database"
    echo "2. Click '.env.local' tab"
    echo "3. Copy the POSTGRES_URL value"
    echo "4. Create .env.local in your project root with:"
    echo ""
    echo "   POSTGRES_URL=your-neon-connection-string"
    echo ""
    echo "5. Run this script again"
    exit 1
fi

# Check if POSTGRES_URL is set
source .env.local
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ POSTGRES_URL not found in .env.local"
    exit 1
fi

echo "✅ Found .env.local with POSTGRES_URL"
echo ""

# Start dev server
echo "🔧 Starting Next.js dev server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 8

# Initialize database
echo "📊 Creating database tables..."
RESPONSE=$(curl -s http://localhost:3000/api/init-db)
echo ""
echo "Response: $RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Database tables created successfully!"
    echo ""
    echo "🎉 Setup complete! Your database is ready."
    echo ""
    echo "📝 Next steps:"
    echo "1. Deploy backend to Railway (see CONNECTION_SETUP.md Step 2)"
    echo "2. Get Grok API key (see CONNECTION_SETUP.md Step 3)"
    echo "3. Connect frontend to backend (see CONNECTION_SETUP.md Step 4)"
else
    echo "❌ Database initialization failed"
    echo "Check the error message above"
fi

# Kill dev server
kill $DEV_PID 2>/dev/null

echo ""
echo "💡 To test locally: npm run dev"
echo "🌐 To deploy: git push (Vercel auto-deploys)"
