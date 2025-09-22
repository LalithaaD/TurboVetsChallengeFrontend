# Task Management Frontend - Angular + NgRx

A modern, responsive task management frontend built with Angular 17, NgRx for state management, and TailwindCSS for styling. This frontend integrates seamlessly with the NestJS backend API.

## 🚀 Features

### Core Features
- ✅ **Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Task Management** - Full CRUD operations with drag-and-drop support
- ✅ **Role-Based UI** - Different features based on user role (Owner/Admin/Viewer)
- ✅ **Real-time State Management** - NgRx for predictable state management
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support

### Technical Features
- 🎯 **Angular 17** - Latest Angular with standalone components
- 🔄 **NgRx** - State management with effects, reducers, and selectors
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 📱 **Mobile-First** - Responsive design starting from mobile devices
- 🔌 **HTTP Interceptors** - Automatic token handling and error management
- ⚡ **Route Guards** - Authentication and role-based route protection
- 🎭 **TypeScript** - Full type safety throughout the application

## 🏗️ Architecture

### State Management (NgRx)
```
Store/
├── auth/                    # Authentication state
│   ├── auth.actions.ts     # Login, logout, profile actions
│   ├── auth.reducer.ts     # Auth state reducer
│   ├── auth.effects.ts     # Side effects (API calls)
│   └── auth.selectors.ts   # State selectors
├── tasks/                   # Task management state
│   ├── task.actions.ts     # CRUD task actions
│   ├── task.reducer.ts     # Task state reducer
│   ├── task.effects.ts     # Task API effects
│   └── task.selectors.ts   # Task state selectors
└── index.ts                # Store configuration
```

### Component Structure
```
src/app/
├── core/                    # Core services and guards
│   ├── services/           # API services
│   ├── guards/             # Route guards
│   └── interceptors/       # HTTP interceptors
├── features/               # Feature modules
│   ├── auth/              # Authentication
│   ├── dashboard/         # Dashboard
│   ├── tasks/             # Task management
│   └── audit-log/         # Audit logging
├── shared/                # Shared components
│   └── components/        # Reusable components
└── models/                # TypeScript interfaces
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Angular CLI 17+
- Backend server running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run serve
   ```

3. **Open your browser:**
   Navigate to `http://localhost:4200`

### Default Admin Credentials (Seeded)
- **Email**: `test@example.com`
- **Password**: `password123`
- **Role**: Admin (full access)

**Note**: This is the seeded admin account from the backend. Role is determined by the backend JWT token, not client-side selection.

### Backend Integration

The frontend is configured to connect to your NestJS backend via proxy configuration:

- **Development**: `http://localhost:4200` → `http://localhost:3000`
- **API Endpoints**: `/auth/*`, `/tasks/*` → Backend API

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on login page
2. Form validation with reactive forms
3. Dispatch `login` action to NgRx store
4. Auth effect calls backend `/auth/login`
5. On success: store JWT token and user data
6. Redirect to dashboard
7. On failure: display error message

### Route Protection
- **AuthGuard**: Protects routes requiring authentication
- **RoleGuard**: Protects routes based on user role
- **Auto-logout**: Handles 401 responses globally

### Token Management
- JWT tokens stored in localStorage
- Automatic token attachment via HTTP interceptor
- Token refresh handling
- Secure logout with token cleanup

## 📝 Task Management

### Task Operations
- **Create**: Form-based task creation with validation
- **Read**: List view with filtering and sorting
- **Update**: In-place editing with status updates
- **Delete**: Confirmation-based deletion

### Task Features
- **Status Management**: TODO → IN_PROGRESS → IN_REVIEW → DONE
- **Priority Levels**: LOW, MEDIUM, HIGH, URGENT
- **Due Dates**: Date picker with overdue indicators
- **Assignment**: Assign tasks to team members
- **Tags**: Categorize tasks with custom tags
- **Visibility**: Public/private task settings

### Task Filtering & Sorting
- Filter by status, priority, assignee, creator
- Sort by title, priority, due date, creation date
- Real-time search and filtering
- Saved filter preferences

## 👥 User Roles & Permissions

### Owner 👑
- Full access to all features
- Can create, edit, and delete tasks
- Can assign tasks to any user
- Can view audit logs
- Can manage all task properties

### Admin ⚙️
- Can create and edit tasks
- Cannot delete tasks
- Can assign tasks to any user
- Can view audit logs
- Full access to filtering and sorting

### Viewer 👁️
- Read-only access
- Can view all tasks
- Can use filtering and sorting
- Cannot modify any tasks

## 🎨 UI/UX Features

### Responsive Design
- **Mobile (< 768px)**: Single column layout, collapsible navigation
- **Tablet (768px - 1024px)**: Two-column layout
- **Desktop (> 1024px)**: Full sidebar with multi-column task board

### Accessibility
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color schemes

### Loading States
- **Skeleton Loaders**: For initial data loading
- **Spinner Indicators**: For form submissions
- **Progress Bars**: For long-running operations
- **Error Boundaries**: Graceful error handling

## 🔧 Development

### Available Scripts
- `npm run start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Start with proxy configuration
- `npm run test` - Run unit tests

### Code Structure
- **Standalone Components**: No NgModules required
- **Reactive Forms**: Form validation and error handling
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

### State Management Patterns
- **Actions**: Define all possible state changes
- **Reducers**: Pure functions that handle state transitions
- **Effects**: Handle side effects (API calls, navigation)
- **Selectors**: Memoized state queries
- **Store**: Single source of truth

## 🌐 API Integration

### HTTP Interceptors
- **Auth Interceptor**: Automatically adds JWT tokens
- **Error Interceptor**: Handles 401 responses globally
- **Loading Interceptor**: Shows loading states

### API Services
- **AuthService**: Authentication endpoints
- **TaskService**: Task CRUD operations
- **Error Handling**: Consistent error management

### Backend Endpoints
```
Authentication:
- POST /auth/login
- POST /auth/register
- GET /auth/profile
- POST /auth/logout

Tasks:
- GET /tasks
- POST /tasks
- GET /tasks/:id
- PUT /tasks/:id
- DELETE /tasks/:id
- PATCH /tasks/:id/status
- GET /tasks/audit-log
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "serve"]
```

## 🧪 Testing

### Unit Tests
- **Components**: Component testing with TestBed
- **Services**: Service testing with mocks
- **Effects**: Effect testing with marble testing
- **Selectors**: Selector testing with mock state

### E2E Tests
- **Cypress**: End-to-end testing
- **User Flows**: Complete user journeys
- **Cross-browser**: Chrome, Firefox, Safari

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Documentation

- [Backend API Documentation](../TASK_API_DOCUMENTATION.md)
- [Backend Setup Guide](../BACKEND_SETUP.md)
- [RBAC Documentation](../libs/auth/RBAC_README.md)

## 🆘 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend CORS is configured for `http://localhost:4200`
- Check proxy configuration in `proxy.conf.json`

**2. Authentication Issues**
- Verify JWT token is being stored in localStorage
- Check token expiration (default: 24 hours)
- Ensure backend is running on port 3000

**3. Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Angular CLI version: `ng version`
- Verify TypeScript version compatibility

**4. State Management Issues**
- Check Redux DevTools for state inspection
- Verify actions are being dispatched
- Check effects are properly configured

### Getting Help

**Check Application Status:**
```bash
# Health check
curl http://localhost:4200

# API health check
curl http://localhost:3000/
```

**Debug Mode:**
- Enable Redux DevTools in browser
- Check browser console for errors
- Use Angular DevTools extension
- Inspect network requests in DevTools

**Logs:**
- Check browser console for client-side errors
- Check backend logs for API errors
- Use NgRx DevTools for state debugging
