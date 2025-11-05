#!/bin/bash

# Railway Backend Test Script
echo "🧪 Testing Railway Backend..."
echo ""

# Ask for Railway URL
read -p "Enter your Railway backend URL (e.g., https://your-backend.up.railway.app): " BACKEND_URL

# Remove trailing slash if present
BACKEND_URL=${BACKEND_URL%/}

echo ""
echo "Testing: $BACKEND_URL"
echo "========================"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed!"
    echo "Response: $RESPONSE_BODY"
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi

echo ""

# Test 2: API Docs
echo "2️⃣ Testing /docs endpoint..."
DOCS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/docs")
if [ "$DOCS_CODE" = "200" ]; then
    echo "✅ API docs available at: $BACKEND_URL/docs"
else
    echo "⚠️  API docs returned HTTP $DOCS_CODE"
fi

echo ""

# Test 3: Papers endpoint
echo "3️⃣ Testing /papers endpoint..."
PAPERS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/papers")
PAPERS_CODE=$(echo "$PAPERS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
PAPERS_BODY=$(echo "$PAPERS_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$PAPERS_CODE" = "200" ]; then
    echo "✅ Papers endpoint working!"
    echo "Response: $PAPERS_BODY"
else
    echo "❌ Papers endpoint failed (HTTP $PAPERS_CODE)"
fi

echo ""
echo "========================"
echo "🎉 Backend is running!"
echo ""
echo "📝 Next steps:"
echo "1. Get Grok API key from https://console.x.ai/"
echo "2. Add it to Railway environment variables"
echo "3. Add this URL to Vercel: $BACKEND_URL"
echo ""
echo "🔗 Useful URLs:"
echo "   Health: $BACKEND_URL/health"
echo "   API Docs: $BACKEND_URL/docs"
echo "   Stats: $BACKEND_URL/stats"
