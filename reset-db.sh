#!/bin/bash

# Reset Database - Clear all papers, keywords, summaries, and trends

echo "🗑️  Resetting HCI Research Database..."

BACKEND_URL="https://hciresearchagent-production.up.railway.app"

# You'll need to create a reset endpoint in the backend
# For now, let's just show what needs to be done

echo ""
echo "To reset the database, you need to:"
echo "1. Go to Railway Dashboard"
echo "2. Click on your PostgreSQL database"
echo "3. Click 'Query' tab"
echo "4. Run these SQL commands:"
echo ""
echo "DELETE FROM summaries;"
echo "DELETE FROM keywords;"
echo "DELETE FROM trends;"
echo "DELETE FROM papers;"
echo ""
echo "Then trigger the workflow again to fetch fresh papers with summaries!"
