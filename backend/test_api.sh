#!/bin/bash

echo "🧪 Testing HCI Research Trends Backend..."
echo ""

# Check if server is running
echo "1️⃣ Testing server health..."
response=$(curl -s http://localhost:8000/health)
if [ $? -eq 0 ]; then
    echo "✅ Server is running!"
    echo "$response" | python -m json.tool
else
    echo "❌ Server is not responding. Make sure it's running on port 8000"
    exit 1
fi

echo ""
echo "2️⃣ Triggering workflow..."
curl -X POST http://localhost:8000/workflow/run \
  -H "Content-Type: application/json" \
  -d '{"force": true}' \
  -s | python -m json.tool

echo ""
echo "3️⃣ Checking papers..."
sleep 5
curl -s "http://localhost:8000/papers?limit=5" | python -m json.tool

echo ""
echo "4️⃣ Checking trends..."
curl -s "http://localhost:8000/trends?limit=5" | python -m json.tool

echo ""
echo "5️⃣ Checking stats..."
curl -s http://localhost:8000/stats | python -m json.tool

echo ""
echo "✨ Test complete!"