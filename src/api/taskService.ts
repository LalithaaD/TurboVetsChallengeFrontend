import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  SortOptions,
  ApiResponse,
  PaginatedResponse
} from '../types';
import { authService } from './authService';

const API_BASE_URL = '/api';

class TaskService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTasks(
    filters?: TaskFilters, 
    sort?: SortOptions, 
    page = 1, 
    limit = 50
  ): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters?.status?.length) {
      params.append('status', filters.status.join(','));
    }
    if (filters?.priority?.length) {
      params.append('priority', filters.priority.join(','));
    }
    if (filters?.category?.length) {
      params.append('category', filters.category.join(','));
    }
    if (filters?.assigneeId) {
      params.append('assigneeId', filters.assigneeId);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (sort?.field) {
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.order);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return this.request<PaginatedResponse<Task>>(`/tasks?${params}`);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async reorderTasks(taskIds: string[]): Promise<void> {
    return this.request<void>('/tasks/reorder', {
      method: 'PUT',
      body: JSON.stringify({ taskIds }),
    });
  }
}

export const taskService = new TaskService();
