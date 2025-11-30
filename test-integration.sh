#!/bin/bash

# Test script to verify W2L Agent Integration is working
# This script checks that all components are properly configured

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   W2L Agent Integration Test Suite    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${BLUE}Testing: ${test_name}${NC}"
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}\n"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}\n"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Check project structure
run_test "Project structure" "
    [ -d '$PROJECT_ROOT/agent_server' ] && 
    [ -d '$PROJECT_ROOT/server' ] && 
    [ -d '$PROJECT_ROOT/playground' ]
"

# Test 2: Check agent server files
run_test "Agent server files exist" "
    [ -f '$PROJECT_ROOT/agent_server/server.js' ] && 
    [ -f '$PROJECT_ROOT/agent_server/tools.js' ] && 
    [ -f '$PROJECT_ROOT/agent_server/package.json' ]
"

# Test 3: Check playground server files
run_test "Playground server files exist" "
    [ -f '$PROJECT_ROOT/server/server.js' ] && 
    [ -f '$PROJECT_ROOT/server/llm.js' ] && 
    [ -f '$PROJECT_ROOT/server/database.js' ]
"

# Test 4: Check integration files
run_test "Integration documentation exists" "
    [ -f '$PROJECT_ROOT/AGENT_INTEGRATION.md' ] && 
    [ -f '$PROJECT_ROOT/start-all.sh' ] && 
    [ -x '$PROJECT_ROOT/start-all.sh' ]
"

# Test 5: Check environment template
run_test "Environment template updated" "
    grep -q 'USE_AGENT_SERVER' '$PROJECT_ROOT/server/env.template' && 
    grep -q 'AGENT_SERVER_URL' '$PROJECT_ROOT/server/env.template'
"

# Test 6: Check llm.js has agent integration
run_test "LLM.js has agent integration" "
    grep -q 'streamAgentCompletion' '$PROJECT_ROOT/server/llm.js' && 
    grep -q 'USE_AGENT_SERVER' '$PROJECT_ROOT/server/llm.js' && 
    grep -q 'AGENT_SERVER_URL' '$PROJECT_ROOT/server/llm.js'
"

# Test 7: Check node_modules (agent server)
if [ -d "$PROJECT_ROOT/agent_server/node_modules" ]; then
    echo -e "${BLUE}Testing: Agent server dependencies${NC}"
    if [ -d "$PROJECT_ROOT/agent_server/node_modules/@cerebras" ]; then
        echo -e "${GREEN}✅ PASS${NC}\n"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠️  SKIP - Cerebras SDK not installed${NC}\n"
        echo -e "   Run: cd agent_server && npm install\n"
    fi
else
    echo -e "${BLUE}Testing: Agent server dependencies${NC}"
    echo -e "${YELLOW}⚠️  SKIP - Dependencies not installed${NC}\n"
    echo -e "   Run: cd agent_server && npm install\n"
fi

# Test 8: Check node_modules (playground server)
if [ -d "$PROJECT_ROOT/server/node_modules" ]; then
    echo -e "${BLUE}Testing: Playground server dependencies${NC}"
    echo -e "${GREEN}✅ PASS${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${BLUE}Testing: Playground server dependencies${NC}"
    echo -e "${YELLOW}⚠️  SKIP - Dependencies not installed${NC}\n"
    echo -e "   Run: cd server && npm install\n"
fi

# Test 9: Check for API keys (optional)
echo -e "${BLUE}Testing: Environment configuration${NC}"
if [ -f "$PROJECT_ROOT/.env" ] || [ -f "$PROJECT_ROOT/agent_server/.env" ]; then
    if grep -q "CEREBRAS_API_KEY" "$PROJECT_ROOT/.env" 2>/dev/null || 
       grep -q "CEREBRAS_API_KEY" "$PROJECT_ROOT/agent_server/.env" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS - Cerebras API key configured${NC}\n"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠️  WARN - Cerebras API key not found${NC}\n"
        echo -e "   Add CEREBRAS_API_KEY to .env file\n"
    fi
else
    echo -e "${YELLOW}⚠️  WARN - No .env file found${NC}\n"
    echo -e "   Create .env with: echo 'CEREBRAS_API_KEY=your-key' > .env\n"
fi

if [ -f "$PROJECT_ROOT/server/.env" ]; then
    if grep -q "USE_AGENT_SERVER=true" "$PROJECT_ROOT/server/.env"; then
        echo -e "${BLUE}Testing: Agent server enabled${NC}"
        echo -e "${GREEN}✅ PASS - USE_AGENT_SERVER=true${NC}\n"
        ((TESTS_PASSED++))
    else
        echo -e "${BLUE}Testing: Agent server enabled${NC}"
        echo -e "${YELLOW}⚠️  INFO - USE_AGENT_SERVER not set to true${NC}\n"
        echo -e "   To enable: Set USE_AGENT_SERVER=true in server/.env\n"
    fi
else
    echo -e "${BLUE}Testing: Server environment${NC}"
    echo -e "${YELLOW}⚠️  WARN - No server/.env file${NC}\n"
    echo -e "   Run: cd server && cp env.template .env\n"
fi

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Test Results                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}\n"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}\n"
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "1. Install dependencies:"
    echo -e "   ${YELLOW}cd agent_server && npm install${NC}"
    echo -e "   ${YELLOW}cd server && npm install${NC}"
    echo -e "   ${YELLOW}cd playground && npm install${NC}"
    echo -e ""
    echo -e "2. Configure API key:"
    echo -e "   ${YELLOW}echo 'CEREBRAS_API_KEY=your-key' > .env${NC}"
    echo -e "   ${YELLOW}cd server && cp env.template .env${NC}"
    echo -e ""
    echo -e "3. Start all services:"
    echo -e "   ${YELLOW}./start-all.sh${NC}"
    echo -e ""
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the output above.${NC}\n"
    exit 1
fi

