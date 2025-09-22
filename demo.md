# Demo Instructions

## Quick Start

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

## Demo Features to Test

### 1. Login & User Roles
The demo now includes a **login screen** where you can select different user roles to test:

**Login Process:**
1. Start the app - you'll see the login screen
2. Select a user role from the dropdown
3. Click "Sign In" to access the dashboard

**User Roles to Test:**

- **Owner (👑)**: Full access - can create, edit, and delete tasks
- **Admin (⚙️)**: Can create and edit tasks, cannot delete
- **Viewer (👁️)**: Read-only access

### 2. Task Management
- **Create Task**: Click "New Task" button in the header
- **Edit Task**: Click the edit icon on any task card
- **Delete Task**: Click the delete icon on any task card (Owner only)
- **Drag & Drop**: Drag tasks between columns to change status

### 3. Filtering & Sorting
- **Search**: Use the search box to find tasks by title or description
- **Filter by Status**: Click the Status filter dropdown
- **Filter by Priority**: Click the Priority filter dropdown  
- **Filter by Category**: Click the Category filter dropdown
- **Filter by Assignee**: Use the assignee dropdown
- **Sort**: Click any sort button to change sorting

### 4. Login/Logout
- **Login**: Select different user roles to test permissions
- **Logout**: Click the logout button in the header to return to login screen
- **Session Persistence**: Your login persists between page reloads

### 5. Responsive Design
- **Mobile**: Resize browser to mobile width to see mobile layout
- **Tablet**: Test tablet layout at medium screen sizes
- **Desktop**: Full three-column layout on large screens

## Sample Data

The demo includes sample tasks with different:
- **Statuses**: To Do, In Progress, Completed
- **Priorities**: Low, Medium, High
- **Categories**: Work, Personal, Shopping, Health, Other
- **Assignees**: John Doe, Jane Smith, Mike Johnson
- **Due Dates**: Some tasks have due dates, some are overdue

### Data Persistence

**✅ Tasks now persist between page reloads!**
- Tasks are automatically saved to browser localStorage
- Your created tasks will remain visible after refreshing the page
- To reset to default sample data, open browser console and run: `resetMockData()`

## Testing Drag & Drop

1. Drag a task from "To Do" to "In Progress" to change its status
2. Drag tasks within the same column to reorder them
3. Notice the visual feedback during dragging

## Role-Based Features

**✅ Login/Logout Now Works!**

The app now has a proper login system:
1. **Login Screen**: Select from 3 different user roles
2. **Logout Button**: Click the logout icon in the header
3. **Session Persistence**: Login state persists between page reloads
4. **Role Switching**: Logout and login as different users to test permissions

**Available Users:**
- **John Doe (Owner)**: Full access - create, edit, delete tasks
- **Jane Smith (Admin)**: Create and edit tasks, cannot delete  
- **Mike Johnson (Viewer)**: Read-only access

## Backend Integration

To connect to a real NestJS backend:

1. Update `src/components/Dashboard.tsx`:
   ```typescript
   // Change from:
   import { taskService, userService } from '../api/demoService';
   // To:
   import { taskService, userService } from '../api/taskService';
   ```

2. Ensure your NestJS backend is running on `http://localhost:3001`

3. The API endpoints should match the expected structure in `src/api/taskService.ts`

## Troubleshooting

- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **TypeScript errors**: Check that all types are properly imported
- **Styling issues**: Ensure TailwindCSS is properly configured
- **Drag & drop not working**: Check that React Beautiful DnD is properly installed

## Next Steps

1. **Customize**: Modify colors, layouts, or add new features
2. **Connect Backend**: Switch from demo service to real API calls
3. **Add Authentication**: Implement proper login/logout functionality
4. **Add Real-time Updates**: Use WebSockets for live task updates
5. **Add Notifications**: Implement task due date notifications
