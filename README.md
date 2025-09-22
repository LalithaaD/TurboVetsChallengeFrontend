# Task Management Dashboard

A modern, responsive task management dashboard built with React, TypeScript, and TailwindCSS. Features drag-and-drop functionality, role-based access control, and real-time task management.

## Features

### Core Features
- ✅ **JWT Authentication** - Secure login with email/password and JWT tokens
- ✅ **Create/Edit/Delete Tasks** - Full CRUD operations for task management
- ✅ **Sort, Filter, and Categorize** - Advanced filtering by status, priority, category, and assignee
- ✅ **Drag-and-Drop** - Reorder tasks and change status with intuitive drag-and-drop
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Role-Based Access Control** - UI and backend enforcement based on user role (Owner/Admin/Viewer)

### Technical Features
- 🎨 **TailwindCSS** - Modern utility-first CSS framework
- 🎯 **TypeScript** - Full type safety throughout the application
- 🔄 **React Beautiful DnD** - Smooth drag-and-drop interactions
- 📱 **Mobile-First** - Responsive design starting from mobile devices
- 🔌 **API Integration** - Ready to connect to NestJS backend
- ⚡ **Loading States** - Proper loading and error handling
- 🎭 **Role-Based Access** - UI adapts based on user permissions

## User Roles

### Owner 👑
- Full access to all features
- Can create, edit, and delete tasks
- Can assign tasks to any user
- Can manage all task properties

### Admin ⚙️
- Can create and edit tasks
- Cannot delete tasks
- Can assign tasks to any user
- Full access to filtering and sorting

### Viewer 👁️
- Read-only access
- Can view all tasks
- Can use filtering and sorting
- Cannot modify any tasks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

## Authentication

The application now uses JWT-based authentication with email/password login.

### Demo Accounts

Use these pre-seeded accounts to test different user roles:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `owner@example.com` | `pass123` | Owner | Full CRUD access |
| `admin@example.com` | `pass123` | Admin | Create/Edit only |
| `viewer@example.com` | `pass123` | Viewer | Read-only access |

### Login Process

1. Enter your email and password
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage and included in API requests
4. User role determines UI features and backend permissions

### Backend Integration

The frontend is configured to connect to a NestJS backend running on `http://localhost:3000`. Update the proxy configuration in `vite.config.ts` if your backend runs on a different port.

#### Required API Endpoints

The application expects the following API endpoints:

**Authentication:**
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and invalidate token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

**Tasks:**
- `GET /api/tasks` - Get tasks with filtering and sorting
- `POST /api/tasks` - Create new task (Owner/Admin only)
- `PUT /api/tasks/:id` - Update task (Owner/Admin only)
- `DELETE /api/tasks/:id` - Delete task (Owner only)
- `PATCH /api/tasks/:id/status` - Update task status (Owner/Admin only)
- `PUT /api/tasks/reorder` - Reorder tasks

**Users:**
- `GET /api/users` - Get all users (for task assignment)

All endpoints require JWT token in Authorization header: `Bearer <token>`

See `BACKEND_SEED_DATA.md` for detailed backend implementation requirements.

## Project Structure

```
src/
├── api/                 # API service layer
│   ├── authService.ts   # Authentication API calls
│   ├── taskService.ts   # Task API calls
│   └── userService.ts   # User API calls
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── TaskBoard.tsx    # Drag-and-drop task board
│   ├── TaskCard.tsx     # Individual task component
│   ├── TaskColumn.tsx   # Task column for board
│   ├── TaskForm.tsx     # Create/edit task form
│   ├── TaskFilters.tsx  # Filter controls
│   ├── TaskSort.tsx     # Sort controls
│   ├── Header.tsx       # Application header
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── cn.ts           # Class name utility
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Beautiful DnD** - Drag and drop
- **Lucide React** - Icons
- **clsx** - Conditional class names

## Responsive Design

The dashboard is built with a mobile-first approach:

- **Mobile (< 768px)**: Single column layout, collapsible filters
- **Tablet (768px - 1024px)**: Two-column task board
- **Desktop (> 1024px)**: Three-column task board with full sidebar

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+


## License

MIT License - see LICENSE file for details.
