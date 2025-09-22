#!/bin/bash

echo "🔐 Testing Backend RBAC (Role-Based Access Control)"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="http://localhost:3000"

echo -e "${YELLOW}1. Testing Admin Login (should work)${NC}"
ADMIN_RESPONSE=$(curl -s -X POST $BACKEND_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

if echo "$ADMIN_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Admin login successful${NC}"
    ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "Admin token: ${ADMIN_TOKEN:0:20}..."
else
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $ADMIN_RESPONSE"
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Creating a test task with Admin token${NC}"
TASK_RESPONSE=$(curl -s -X POST $BACKEND_URL/tasks \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task for RBAC","description":"This task will be used to test RBAC","priority":"MEDIUM","isPublic":true}')

if echo "$TASK_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅ Task created successfully${NC}"
    TASK_ID=$(echo "$TASK_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Task ID: $TASK_ID"
else
    echo -e "${RED}❌ Task creation failed${NC}"
    echo "Response: $TASK_RESPONSE"
    exit 1
fi

echo ""
echo -e "${YELLOW}3. Testing Admin DELETE task (should work)${NC}"
DELETE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X DELETE $BACKEND_URL/tasks/$TASK_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_STATUS=$(echo $DELETE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo $DELETE_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 204 ]; then
    echo -e "${GREEN}✅ Admin can delete tasks (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}❌ Admin cannot delete tasks (HTTP $HTTP_STATUS)${NC}"
    echo "Response: $RESPONSE_BODY"
fi

echo ""
echo -e "${YELLOW}4. Creating another test task for Viewer test${NC}"
TASK_RESPONSE2=$(curl -s -X POST $BACKEND_URL/tasks \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task for Viewer RBAC","description":"This task will test Viewer permissions","priority":"LOW","isPublic":true}')

if echo "$TASK_RESPONSE2" | grep -q '"id"'; then
    echo -e "${GREEN}✅ Second task created successfully${NC}"
    TASK_ID2=$(echo "$TASK_RESPONSE2" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Task ID: $TASK_ID2"
else
    echo -e "${RED}❌ Second task creation failed${NC}"
    echo "Response: $TASK_RESPONSE2"
    exit 1
fi

echo ""
echo -e "${YELLOW}5. Testing Viewer Login (if available)${NC}"
# Note: This assumes you have a viewer user in your backend
# You may need to create one or use a different approach
VIEWER_RESPONSE=$(curl -s -X POST $BACKEND_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@example.com","password":"password123"}')

if echo "$VIEWER_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Viewer login successful${NC}"
    VIEWER_TOKEN=$(echo "$VIEWER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "Viewer token: ${VIEWER_TOKEN:0:20}..."
    
    echo ""
    echo -e "${YELLOW}6. Testing Viewer DELETE task (should return 403)${NC}"
    VIEWER_DELETE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X DELETE $BACKEND_URL/tasks/$TASK_ID2 \
      -H "Authorization: Bearer $VIEWER_TOKEN")
    
    VIEWER_HTTP_STATUS=$(echo $VIEWER_DELETE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    VIEWER_RESPONSE_BODY=$(echo $VIEWER_DELETE_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$VIEWER_HTTP_STATUS" -eq 403 ]; then
        echo -e "${GREEN}✅ RBAC working correctly - Viewer cannot delete tasks (HTTP 403)${NC}"
    elif [ "$VIEWER_HTTP_STATUS" -eq 200 ] || [ "$VIEWER_HTTP_STATUS" -eq 204 ]; then
        echo -e "${RED}❌ RBAC NOT working - Viewer can delete tasks (HTTP $VIEWER_HTTP_STATUS)${NC}"
        echo -e "${RED}   This is a security issue! Fix the backend RBAC.${NC}"
    else
        echo -e "${YELLOW}⚠️  Unexpected response for Viewer DELETE (HTTP $VIEWER_HTTP_STATUS)${NC}"
        echo "Response: $VIEWER_RESPONSE_BODY"
    fi
else
    echo -e "${YELLOW}⚠️  No viewer user found. Creating one for testing...${NC}"
    
    # Try to register a viewer user
    REGISTER_RESPONSE=$(curl -s -X POST $BACKEND_URL/auth/register \
      -H "Content-Type: application/json" \
      -d '{"email":"viewer@example.com","username":"viewer","password":"password123","firstName":"Viewer","lastName":"User"}')
    
    if echo "$REGISTER_RESPONSE" | grep -q "access_token"; then
        echo -e "${GREEN}✅ Viewer user created and logged in${NC}"
        VIEWER_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
        echo "Viewer token: ${VIEWER_TOKEN:0:20}..."
        
        echo ""
        echo -e "${YELLOW}6. Testing Viewer DELETE task (should return 403)${NC}"
        VIEWER_DELETE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X DELETE $BACKEND_URL/tasks/$TASK_ID2 \
          -H "Authorization: Bearer $VIEWER_TOKEN")
        
        VIEWER_HTTP_STATUS=$(echo $VIEWER_DELETE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        VIEWER_RESPONSE_BODY=$(echo $VIEWER_DELETE_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
        
        if [ "$VIEWER_HTTP_STATUS" -eq 403 ]; then
            echo -e "${GREEN}✅ RBAC working correctly - Viewer cannot delete tasks (HTTP 403)${NC}"
        elif [ "$VIEWER_HTTP_STATUS" -eq 200 ] || [ "$VIEWER_HTTP_STATUS" -eq 204 ]; then
            echo -e "${RED}❌ RBAC NOT working - Viewer can delete tasks (HTTP $VIEWER_HTTP_STATUS)${NC}"
            echo -e "${RED}   This is a security issue! Fix the backend RBAC.${NC}"
        else
            echo -e "${YELLOW}⚠️  Unexpected response for Viewer DELETE (HTTP $VIEWER_HTTP_STATUS)${NC}"
            echo "Response: $VIEWER_RESPONSE_BODY"
        fi
    else
        echo -e "${RED}❌ Could not create viewer user${NC}"
        echo "Response: $REGISTER_RESPONSE"
    fi
fi

echo ""
echo -e "${YELLOW}7. Testing unauthorized access (no token)${NC}"
UNAUTH_DELETE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X DELETE $BACKEND_URL/tasks/$TASK_ID2)

UNAUTH_HTTP_STATUS=$(echo $UNAUTH_DELETE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
UNAUTH_RESPONSE_BODY=$(echo $UNAUTH_DELETE_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$UNAUTH_HTTP_STATUS" -eq 401 ]; then
    echo -e "${GREEN}✅ Unauthorized access properly blocked (HTTP 401)${NC}"
else
    echo -e "${RED}❌ Unauthorized access not properly blocked (HTTP $UNAUTH_HTTP_STATUS)${NC}"
    echo "Response: $UNAUTH_RESPONSE_BODY"
fi

echo ""
echo "=================================================="
echo -e "${YELLOW}RBAC Test Summary:${NC}"
echo "1. Admin login: ✅"
echo "2. Admin create task: ✅"
echo "3. Admin delete task: ✅"
echo "4. Viewer delete task: Check results above"
echo "5. Unauthorized access: Check results above"
echo ""
echo -e "${GREEN}If Viewer can delete tasks, this is a security issue!${NC}"
echo -e "${GREEN}Backend RBAC must be fixed to prevent unauthorized access.${NC}"
