#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Starting W2L LLM Playground...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if server/.env exists
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found in server/ directory${NC}"
    
    # Check if template exists
    if [ -f "server/env.template" ]; then
        echo -e "${BLUE}Would you like to copy the template? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            cp server/env.template server/.env
            echo -e "${GREEN}✅ Created server/.env from template${NC}"
            echo -e "${YELLOW}⚠️  Please edit server/.env and add your OpenAI API key${NC}"
            echo -e "${BLUE}Opening .env file...${NC}\n"
            ${EDITOR:-nano} server/.env
        else
            echo -e "${YELLOW}Please create server/.env manually:${NC}"
            echo -e "${GREEN}cp server/env.template server/.env${NC}"
            echo -e "${GREEN}# Then edit it with your OpenAI API key${NC}\n"
            exit 1
        fi
    else
        echo -e "${YELLOW}Please create server/.env with your OpenAI API key:${NC}"
        echo -e "${GREEN}OPENAI_API_KEY=your_key_here${NC}"
        echo -e "${GREEN}PORT=3001${NC}\n"
        exit 1
    fi
fi

# Check if API key is set (basic check)
if grep -q "sk-your-openai-api-key-here" server/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Looks like you haven't updated your API key in server/.env${NC}"
    echo -e "${YELLOW}Please edit server/.env and add your actual OpenAI API key${NC}\n"
    exit 1
fi

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
    cd server && npm install
    cd ..
fi

# Check if playground dependencies are installed
if [ ! -d "playground/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing playground dependencies...${NC}"
    cd playground && npm install
    cd ..
fi

echo -e "${GREEN}✅ Dependencies ready${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend server
echo -e "${BLUE}🚀 Starting backend server on port 3001...${NC}"
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend server
echo -e "${BLUE}🚀 Starting frontend server on port 3000...${NC}"
cd playground
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}✅ Both servers started!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend:  http://localhost:3001${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Wait for both processes
wait $SERVER_PID $FRONTEND_PID

