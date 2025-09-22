# Authentication Setup Guide

## Current Setup: Demo Mode

The application is currently configured to use **demo authentication** which simulates JWT authentication without requiring a backend.

### Demo Accounts (Working Now)

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `owner@example.com` | `pass123` | Owner | Full CRUD access |
| `admin@example.com` | `pass123` | Admin | Create/Edit only |
| `viewer@example.com` | `pass123` | Viewer | Read-only access |

### How to Test

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3001`
3. Use any of the demo accounts above to log in
4. The UI will adapt based on the user role

## Switching to Real Backend Authentication

When you're ready to connect to your NestJS backend:

### Step 1: Update Import Statements

In `src/components/Login.tsx`:
```typescript
// Change from:
import { authService } from '../api/demoAuthService';

// To:
import { authService } from '../api/authService';
```

In `src/components/Dashboard.tsx`:
```typescript
// Change from:
import { authService } from '../api/demoAuthService';
import { taskService, userService } from '../api/demoService';

// To:
import { authService } from '../api/authService';
import { taskService } from '../api/taskService';
import { userService } from '../api/userService';
```

### Step 2: Ensure Backend is Running

Make sure your NestJS backend is running on `http://localhost:3000` with the endpoints specified in `BACKEND_SEED_DATA.md`.

### Step 3: Seed Your Backend Database

Create the demo accounts in your backend database:
- `owner@example.com` / `pass123` (role: owner)
- `admin@example.com` / `pass123` (role: admin)  
- `viewer@example.com` / `pass123` (role: viewer)

## Files Overview

### Demo Mode (Current)
- `src/api/demoAuthService.ts` - Simulates JWT authentication
- `src/api/demoService.ts` - Uses mock data for tasks and users
- `src/api/mockData.ts` - Mock data definitions

### Production Mode (For Backend)
- `src/api/authService.ts` - Real JWT authentication with backend
- `src/api/taskService.ts` - Real API calls for tasks
- `src/api/userService.ts` - Real API calls for users

## Testing Both Modes

You can easily switch between demo and production modes by changing the import statements. This allows you to:

1. **Develop and test** the frontend without a backend (demo mode)
2. **Integrate and test** with your real backend (production mode)
3. **Demo the application** to stakeholders using demo mode

## Current Status

✅ **Demo Mode**: Fully functional with simulated JWT authentication  
🔄 **Production Mode**: Ready to use when backend is implemented  
📋 **Backend Specs**: Complete requirements in `BACKEND_SEED_DATA.md`
