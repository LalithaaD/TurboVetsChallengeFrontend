// Demo service that uses mock data instead of real API calls
// This allows you to test the application without a backend

import { mockTaskService, mockUserService } from './mockData';

// Export the mock services as the main services for demo purposes
export const taskService = mockTaskService;
export const userService = mockUserService;

// To switch to real API calls, replace the imports above with:
// export { taskService, userService } from './taskService';
