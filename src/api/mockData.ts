import { Task, User, CreateTaskRequest, UpdateTaskRequest, TaskFilters, SortOptions, PaginatedResponse } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  },
];

// Load tasks from localStorage or use default mock data
const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem('mockTasks');
    return stored ? JSON.parse(stored) : defaultMockTasks;
  } catch {
    return defaultMockTasks;
  }
};

const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
  } catch (error) {
    console.warn('Failed to save tasks to localStorage:', error);
  }
};

// Default mock tasks
const defaultMockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch',
    status: 'todo',
    priority: 'high',
    category: 'work',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    assigneeId: '2',
    assigneeName: 'Jane Smith',
    createdById: '1',
    createdByName: 'John Doe',
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Weekly grocery shopping for the family',
    status: 'in-progress',
    priority: 'medium',
    category: 'shopping',
    dueDate: '2024-01-20',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '2',
    createdByName: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Review quarterly reports',
    description: 'Analyze Q4 performance metrics and prepare summary',
    status: 'completed',
    priority: 'high',
    category: 'work',
    dueDate: '2024-01-18',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '1',
    createdByName: 'John Doe',
  },
  {
    id: '4',
    title: 'Schedule dentist appointment',
    description: 'Book regular dental checkup',
    status: 'todo',
    priority: 'low',
    category: 'health',
    createdAt: '2024-01-16T11:20:00Z',
    updatedAt: '2024-01-16T11:20:00Z',
    createdById: '3',
    createdByName: 'Mike Johnson',
  },
  {
    id: '5',
    title: 'Plan weekend trip',
    description: 'Research and book accommodation for weekend getaway',
    status: 'in-progress',
    priority: 'medium',
    category: 'personal',
    dueDate: '2024-01-25',
    createdAt: '2024-01-12T15:45:00Z',
    updatedAt: '2024-01-17T10:30:00Z',
    assigneeId: '2',
    assigneeName: 'Jane Smith',
    createdById: '2',
    createdByName: 'Jane Smith',
  },
  {
    id: '6',
    title: 'Update project documentation',
    description: 'Review and update technical documentation for the current project',
    status: 'todo',
    priority: 'medium',
    category: 'work',
    dueDate: '2024-01-22',
    createdAt: '2024-01-15T13:15:00Z',
    updatedAt: '2024-01-15T13:15:00Z',
    assigneeId: '3',
    assigneeName: 'Mike Johnson',
    createdById: '1',
    createdByName: 'John Doe',
  },
];

// Initialize tasks array
let mockTasks = loadTasksFromStorage();

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }
    if (filters.category && filters.category.length > 0 && !filters.category.includes(task.category)) {
      return false;
    }
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchTerm);
      const matchesDescription = task.description.toLowerCase().includes(searchTerm);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }
    return true;
  });
};

const sortTasks = (tasks: Task[], sortOptions: SortOptions): Task[] => {
  return [...tasks].sort((a, b) => {
    let aValue: any = a[sortOptions.field];
    let bValue: any = b[sortOptions.field];

    // Handle date fields
    if (sortOptions.field === 'dueDate' || sortOptions.field === 'createdAt') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    // Handle string fields
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOptions.order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

// Mock API functions
export const mockTaskService = {
  async getTasks(
    filters?: TaskFilters,
    sort?: SortOptions,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<Task>> {
    await delay(500); // Simulate API delay

    let filteredTasks = filterTasks(mockTasks, filters || {});
    filteredTasks = sortTasks(filteredTasks, sort || { field: 'createdAt', order: 'desc' });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      data: paginatedTasks,
      total: filteredTasks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTasks.length / limit),
    };
  },

  async getTaskById(id: string): Promise<Task> {
    await delay(200);
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    await delay(300);
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: '1', // Mock current user ID
      createdByName: 'John Doe',
      assigneeName: taskData.assigneeId ? mockUsers.find(u => u.id === taskData.assigneeId)?.name : undefined,
    };
    mockTasks.unshift(newTask);
    saveTasksToStorage(mockTasks);
    return newTask;
  },

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    await delay(300);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
      assigneeName: taskData.assigneeId ? mockUsers.find(u => u.id === taskData.assigneeId)?.name : mockTasks[taskIndex].assigneeName,
    };

    mockTasks[taskIndex] = updatedTask;
    saveTasksToStorage(mockTasks);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    await delay(200);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    mockTasks.splice(taskIndex, 1);
    saveTasksToStorage(mockTasks);
  },

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    await delay(200);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      status: status as any,
      updatedAt: new Date().toISOString(),
    };

    mockTasks[taskIndex] = updatedTask;
    saveTasksToStorage(mockTasks);
    return updatedTask;
  },

  async reorderTasks(taskIds: string[]): Promise<void> {
    await delay(200);
    // In a real app, this would update the order in the backend
    console.log('Reordering tasks:', taskIds);
  },
};

export const mockUserService = {
  async getCurrentUser(): Promise<User> {
    await delay(200);
    return mockUsers[0]; // Return John Doe as current user
  },

  async getUsers(): Promise<User[]> {
    await delay(200);
    return mockUsers;
  },

  async getUserById(id: string): Promise<User> {
    await delay(200);
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

// Utility function to reset mock data
export const resetMockData = () => {
  localStorage.removeItem('mockTasks');
  mockTasks = [...defaultMockTasks];
  saveTasksToStorage(mockTasks);
  console.log('Mock data reset to defaults');
};
