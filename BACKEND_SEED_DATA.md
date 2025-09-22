# Backend Seed Data

This document outlines the seed data that should be created in your backend database for testing the authentication system.

## User Accounts

Create the following user accounts in your backend database:

### Owner Account
```json
{
  "email": "owner@example.com",
  "password": "pass123",
  "name": "John Owner",
  "role": "owner"
}
```

### Admin Account
```json
{
  "email": "admin@example.com", 
  "password": "pass123",
  "name": "Jane Admin",
  "role": "admin"
}
```

### Viewer Account
```json
{
  "email": "viewer@example.com",
  "password": "pass123", 
  "name": "Bob Viewer",
  "role": "viewer"
}
```

## Backend API Endpoints

Your backend should implement the following endpoints:

### Authentication Endpoints

#### POST /api/auth/login
```json
// Request
{
  "email": "owner@example.com",
  "password": "pass123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "name": "John Owner",
    "email": "owner@example.com",
    "role": "owner"
  }
}
```

#### POST /api/auth/logout
```json
// Request Headers
{
  "Authorization": "Bearer <token>"
}

// Response
{
  "message": "Logged out successfully"
}
```

#### POST /api/auth/refresh
```json
// Request Headers
{
  "Authorization": "Bearer <token>"
}

// Response
{
  "token": "new-jwt-token"
}
```

#### GET /api/auth/me
```json
// Request Headers
{
  "Authorization": "Bearer <token>"
}

// Response
{
  "id": "user-id",
  "name": "John Owner", 
  "email": "owner@example.com",
  "role": "owner"
}
```

### User Management Endpoints

#### GET /api/users
```json
// Request Headers
{
  "Authorization": "Bearer <token>"
}

// Response
[
  {
    "id": "user-1",
    "name": "John Owner",
    "email": "owner@example.com", 
    "role": "owner"
  },
  {
    "id": "user-2",
    "name": "Jane Admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  {
    "id": "user-3", 
    "name": "Bob Viewer",
    "email": "viewer@example.com",
    "role": "viewer"
  }
]
```

### Task Management Endpoints

All task endpoints should include JWT token validation and role-based authorization:

#### GET /api/tasks
- **Authorization**: Bearer token required
- **Role restrictions**: All roles can read tasks

#### POST /api/tasks
- **Authorization**: Bearer token required  
- **Role restrictions**: Owner and Admin only

#### PUT /api/tasks/:id
- **Authorization**: Bearer token required
- **Role restrictions**: Owner and Admin only

#### DELETE /api/tasks/:id
- **Authorization**: Bearer token required
- **Role restrictions**: Owner only

#### PATCH /api/tasks/:id/status
- **Authorization**: Bearer token required
- **Role restrictions**: Owner and Admin only

## JWT Token Structure

Your JWT tokens should include the following payload:

```json
{
  "sub": "user-id",
  "email": "owner@example.com",
  "role": "owner",
  "name": "John Owner",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Role-Based Access Control

### Owner Role
- Full CRUD access to all tasks
- Can create, read, update, and delete tasks
- Can manage all users

### Admin Role  
- Can create and edit tasks
- Cannot delete tasks
- Can read all tasks

### Viewer Role
- Read-only access to tasks
- Cannot create, edit, or delete tasks

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden", 
  "message": "Insufficient permissions for this action"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid email or password"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'viewer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('work', 'personal', 'shopping', 'health', 'other')),
  due_date TIMESTAMP,
  assignee_id UUID REFERENCES users(id),
  created_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Password Hashing**: Use bcrypt or similar to hash passwords
2. **JWT Secret**: Use a strong, random secret for JWT signing
3. **Token Expiration**: Set reasonable expiration times (e.g., 24 hours)
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: Validate all input data
6. **Rate Limiting**: Implement rate limiting on auth endpoints
7. **CORS**: Configure CORS properly for your frontend domain
