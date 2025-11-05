#!/bin/bash

echo "🚀 Setting up HCI Research Trends Backend..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python version
echo -e "${BLUE}1️⃣ Checking Python version...${NC}"
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "   Found Python $python_version"

if python3 -c 'import sys; exit(0 if sys.version_info >= (3, 11) else 1)'; then
    echo -e "   ${GREEN}✅ Python version is compatible${NC}"
else
    echo -e "   ${RED}❌ Python 3.11+ required${NC}"
    exit 1
fi

# Create virtual environment
echo ""
echo -e "${BLUE}2️⃣ Creating virtual environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "   ${GREEN}✅ Virtual environment created${NC}"
else
    echo "   ℹ️  Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo -e "${BLUE}3️⃣ Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "   ${GREEN}✅ Virtual environment activated${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}4️⃣ Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "   ${GREEN}✅ Dependencies installed${NC}"

# Create .env file
echo ""
echo -e "${BLUE}5️⃣ Setting up environment file...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "   ${GREEN}✅ Created .env file${NC}"
    echo -e "   ${RED}⚠️  Please edit .env with your credentials${NC}"
else
    echo "   ℹ️  .env file already exists"
fi

# Summary
echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env with your database URL and API keys"
echo "2. Run: python main.py"
echo "3. Visit: http://localhost:8000"
echo ""
echo "To activate the virtual environment in future:"
echo "  source venv/bin/activate"