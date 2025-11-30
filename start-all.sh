#!/bin/bash

# Start all W2L services for the playground with agent server integration
# This script starts:
# 1. Agent Server (port 3100)
# 2. Playground Server (port 3001)
# 3. Playground UI (port 3000)

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   W2L Playground - Complete Startup    ║"
echo "╔════════════════════════════════════════╗"
echo -e "${NC}"

# Function to check if .env file exists and has required keys
check_env_file() {
    local dir=$1
    local required_keys=("${@:2}")
    local env_file="$dir/.env"
    
    if [ ! -f "$env_file" ]; then
        # Check parent directory too
        if [ -f "../.env" ]; then
            env_file="../.env"
        else
            echo -e "${YELLOW}⚠️  Warning: No .env file found in $dir${NC}"
            echo -e "${YELLOW}   Using defaults or environment variables${NC}"
            return 1
        fi
    fi
    
    for key in "${required_keys[@]}"; do
        if ! grep -q "^$key=" "$env_file" && ! grep -q "^export $key=" "$env_file"; then
            echo -e "${YELLOW}⚠️  Warning: $key not found in $env_file${NC}"
        fi
    done
    
    return 0
}

# Check environment configurations
echo -e "${BLUE}🔍 Checking configurations...${NC}"

cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

# Check agent server env
cd "$PROJECT_ROOT/agent_server"
check_env_file "." "CEREBRAS_API_KEY"

# Check playground server env
cd "$PROJECT_ROOT/server"
check_env_file "." "USE_AGENT_SERVER"

cd "$PROJECT_ROOT"

# Function to kill background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down all services...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Agent Server
echo -e "\n${BLUE}🚀 Starting Agent Server (port 3100)...${NC}"
cd "$PROJECT_ROOT/agent_server"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing agent server dependencies...${NC}"
    npm install
fi
npm run dev > /tmp/w2l-agent-server.log 2>&1 &
AGENT_PID=$!
echo -e "${GREEN}✅ Agent Server started (PID: $AGENT_PID)${NC}"

# Wait a bit for agent server to start
sleep 3

# Start Playground Server
echo -e "\n${BLUE}🚀 Starting Playground Server (port 3001)...${NC}"
cd "$PROJECT_ROOT/server"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing playground server dependencies...${NC}"
    npm install
fi
npm run dev > /tmp/w2l-playground-server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✅ Playground Server started (PID: $SERVER_PID)${NC}"

# Wait a bit for playground server to start
sleep 3

# Start Playground UI
echo -e "\n${BLUE}🚀 Starting Playground UI (port 3000)...${NC}"
cd "$PROJECT_ROOT/playground"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing playground UI dependencies...${NC}"
    npm install
fi
npm run dev > /tmp/w2l-playground-ui.log 2>&1 &
UI_PID=$!
echo -e "${GREEN}✅ Playground UI started (PID: $UI_PID)${NC}"

# Wait for services to be ready
echo -e "\n${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check if services are running
echo -e "\n${BLUE}🔍 Checking service health...${NC}"

check_service() {
    local name=$1
    local url=$2
    local log_file=$3
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name failed to start${NC}"
        echo -e "${YELLOW}   Check logs: tail -f $log_file${NC}"
        return 1
    fi
}

check_service "Agent Server" "http://localhost:3100/health" "/tmp/w2l-agent-server.log"
check_service "Playground Server" "http://localhost:3001/health" "/tmp/w2l-playground-server.log"
check_service "Playground UI" "http://localhost:3000" "/tmp/w2l-playground-ui.log"

# Display summary
echo -e "\n${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎨 All Services Running!      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo -e ""
echo -e "${BLUE}📍 Services:${NC}"
echo -e "   • Agent Server:      ${GREEN}http://localhost:3100${NC}"
echo -e "   • Playground Server: ${GREEN}http://localhost:3001${NC}"
echo -e "   • Playground UI:     ${GREEN}http://localhost:3000${NC}"
echo -e ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   • Agent Server:      ${YELLOW}tail -f /tmp/w2l-agent-server.log${NC}"
echo -e "   • Playground Server: ${YELLOW}tail -f /tmp/w2l-playground-server.log${NC}"
echo -e "   • Playground UI:     ${YELLOW}tail -f /tmp/w2l-playground-ui.log${NC}"
echo -e ""
echo -e "${BLUE}🎯 Open in browser:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo -e ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e ""

# Wait for any process to exit
wait

