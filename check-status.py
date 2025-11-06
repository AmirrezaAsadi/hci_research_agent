#!/usr/bin/env python3
"""
Manually trigger summary and image generation for existing papers
"""
import requests
import time
import json

API_URL = "https://hciresearchagent-production.up.railway.app"

print("📋 Fetching papers...")
response = requests.get(f"{API_URL}/papers?limit=10")
papers = response.json()['data']
print(f"Found {len(papers)} papers\n")

# Note: The backend workflow needs to be running for this to work
# This script is just to show what we need to do

print("To generate summaries and images, the backend workflow needs to run.")
print("The workflow is triggered but seems to be stopping early.")
print("\nChecking stats...")

response = requests.get(f"{API_URL}/stats")
stats = response.json()['data']
print(json.dumps(stats, indent=2))

print("\n✅ Summary:")
print(f"   - Papers: {stats['total_papers']}")
print(f"   - Keywords: {stats['total_keywords']}")
print(f"   - Trends: {stats['total_trends']}")
print(f"   - Summaries: {stats['total_summaries']}")
print(f"   - With Images: {stats['summaries_with_images']}")
