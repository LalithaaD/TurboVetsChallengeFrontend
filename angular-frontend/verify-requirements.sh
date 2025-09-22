#!/bin/bash

echo "🔍 Verifying Frontend Requirements"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking Angular Frontend Implementation...${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Not in Angular frontend directory${NC}"
    echo "Please run this script from the angular-frontend directory"
    exit 1
fi

echo -e "${YELLOW}1. Checking Login Component (No Role Selection)${NC}"
if grep -q "role.*select" src/app/features/auth/login/login.component.ts; then
    echo -e "${RED}❌ Login component has role selection - REMOVE IT${NC}"
else
    echo -e "${GREEN}✅ Login component has no role selection${NC}"
fi

echo ""
echo -e "${YELLOW}2. Checking Token Storage in NgRx${NC}"
if grep -q "localStorage.setItem.*token" src/app/store/auth/auth.reducer.ts; then
    echo -e "${GREEN}✅ Token stored in localStorage${NC}"
else
    echo -e "${RED}❌ Token not stored in localStorage${NC}"
fi

if grep -q "localStorage.removeItem.*token" src/app/store/auth/auth.reducer.ts; then
    echo -e "${GREEN}✅ Token removed from localStorage on logout${NC}"
else
    echo -e "${RED}❌ Token not removed from localStorage on logout${NC}"
fi

echo ""
echo -e "${YELLOW}3. Checking Auth Interceptor${NC}"
if grep -q "Authorization.*Bearer" src/app/core/interceptors/auth.interceptor.ts; then
    echo -e "${GREEN}✅ Auth interceptor adds Bearer token${NC}"
else
    echo -e "${RED}❌ Auth interceptor missing Bearer token${NC}"
fi

echo ""
echo -e "${YELLOW}4. Checking Error Interceptor (401 Handling)${NC}"
if grep -q "401" src/app/core/interceptors/error.interceptor.ts && grep -q "logoutSuccess" src/app/core/interceptors/error.interceptor.ts; then
    echo -e "${GREEN}✅ Error interceptor handles 401 with logout${NC}"
else
    echo -e "${RED}❌ Error interceptor missing 401 handling${NC}"
fi

echo ""
echo -e "${YELLOW}5. Checking Proxy Configuration${NC}"
if grep -q "/auth/\*" proxy.conf.json && grep -q "/tasks/\*" proxy.conf.json; then
    echo -e "${GREEN}✅ Proxy config forwards /auth and /tasks${NC}"
else
    echo -e "${RED}❌ Proxy config missing /auth or /tasks${NC}"
fi

if grep -q "localhost:3000" proxy.conf.json; then
    echo -e "${GREEN}✅ Proxy config targets localhost:3000${NC}"
else
    echo -e "${RED}❌ Proxy config wrong target${NC}"
fi

echo ""
echo -e "${YELLOW}6. Checking README Documentation${NC}"
if grep -q "test@example.com" README.md && grep -q "password123" README.md; then
    echo -e "${GREEN}✅ README documents admin credentials${NC}"
else
    echo -e "${RED}❌ README missing admin credentials${NC}"
fi

if grep -q "seeded" README.md; then
    echo -e "${GREEN}✅ README mentions seeded account${NC}"
else
    echo -e "${YELLOW}⚠️  README should mention seeded account${NC}"
fi

echo ""
echo -e "${YELLOW}7. Checking NgRx Store Structure${NC}"
if [ -d "src/app/store/auth" ] && [ -d "src/app/store/tasks" ]; then
    echo -e "${GREEN}✅ NgRx store structure exists${NC}"
else
    echo -e "${RED}❌ NgRx store structure missing${NC}"
fi

if [ -f "src/app/store/auth/auth.actions.ts" ] && [ -f "src/app/store/auth/auth.reducer.ts" ]; then
    echo -e "${GREEN}✅ Auth store files exist${NC}"
else
    echo -e "${RED}❌ Auth store files missing${NC}"
fi

echo ""
echo -e "${YELLOW}8. Checking Route Guards${NC}"
if [ -f "src/app/core/guards/auth.guard.ts" ] && [ -f "src/app/core/guards/role.guard.ts" ]; then
    echo -e "${GREEN}✅ Route guards exist${NC}"
else
    echo -e "${RED}❌ Route guards missing${NC}"
fi

echo ""
echo -e "${YELLOW}9. Checking API Services${NC}"
if [ -f "src/app/core/services/auth.service.ts" ] && [ -f "src/app/core/services/task.service.ts" ]; then
    echo -e "${GREEN}✅ API services exist${NC}"
else
    echo -e "${RED}❌ API services missing${NC}"
fi

echo ""
echo -e "${YELLOW}10. Checking Component Structure${NC}"
if [ -f "src/app/features/auth/login/login.component.ts" ]; then
    echo -e "${GREEN}✅ Login component exists${NC}"
else
    echo -e "${RED}❌ Login component missing${NC}"
fi

if [ -f "src/app/features/dashboard/dashboard.component.ts" ]; then
    echo -e "${GREEN}✅ Dashboard component exists${NC}"
else
    echo -e "${RED}❌ Dashboard component missing${NC}"
fi

if [ -f "src/app/features/tasks/task-list/task-list.component.ts" ]; then
    echo -e "${GREEN}✅ Task list component exists${NC}"
else
    echo -e "${RED}❌ Task list component missing${NC}"
fi

echo ""
echo "=================================="
echo -e "${BLUE}Frontend Requirements Check Complete${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Start your backend: node simple-nestjs-server.js"
echo "2. Start frontend: npm run serve"
echo "3. Test login with: test@example.com / password123"
echo "4. Run RBAC test: ./test-rbac.sh"
echo ""
echo -e "${GREEN}All requirements should be implemented!${NC}"
