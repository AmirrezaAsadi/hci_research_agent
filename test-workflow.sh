#!/bin/bash

# Test the complete workflow with image generation

API_URL="https://hciresearchagent-production.up.railway.app"

echo "🧹 Step 1: Resetting database..."
curl -X POST "$API_URL/reset"
echo -e "\n"

echo "⏳ Waiting 5 seconds..."
sleep 5

echo "🚀 Step 2: Running workflow (this will take a few minutes)..."
echo "   - Fetching papers from ArXiv"
echo "   - Extracting keywords"
echo "   - Calculating trends"
echo "   - Generating AI summaries"
echo "   - Creating images with Grok"
echo ""
curl -X POST "$API_URL/workflow/run"
echo -e "\n"

echo "⏳ Waiting 3 minutes for workflow to complete..."
sleep 180

echo "📊 Step 3: Checking results..."
curl -s "$API_URL/stats" | python3 -m json.tool
echo ""

echo "🖼️  Step 4: Checking a summary with image..."
curl -s "$API_URL/summaries/51" | python3 -m json.tool
echo ""

echo "✅ Done! Check your website to see the results."
echo "   Papers with summaries will show the '✨ AI Summary' badge"
echo "   Click on any paper to see the modal with image and summary"
