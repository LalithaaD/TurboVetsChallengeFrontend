import React, { useState, useEffect, useCallback } from 'react';
import { Task, User, TaskFilters, SortOptions, CreateTaskRequest, UpdateTaskRequest, TaskStatus, SortField, SortOrder } from '../types';
import { taskService, userService } from '../api/demoService';
import { authService } from '../api/demoAuthService';
import { Header } from './Header';
import { TaskBoard } from './TaskBoard';
import { TaskForm } from './TaskForm';
import { TaskFilters as TaskFiltersComponent } from './TaskFilters';
import { TaskSort } from './TaskSort';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Login } from './Login';

export const Dashboard: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdAt',
    order: 'desc',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load tasks when filters or sort options change
  useEffect(() => {
    if (currentUser) {
      loadTasks();
    }
  }, [filters, sortOptions, currentUser]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (authService.isAuthenticated() && !authService.isTokenExpired()) {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          
          // Load users list for task assignment
          try {
            const usersData = await userService.getUsers();
            setUsers(usersData);
          } catch (err) {
            console.warn('Failed to load users list:', err);
            // Continue without users list - not critical for basic functionality
          }
        }
      } else {
        // Clear any expired/invalid auth data
        authService.clearAuth();
      }
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    if (!currentUser) return;

    try {
      setError(null);
      const response = await taskService.getTasks(filters, sortOptions);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    }
  };

  const handleCreateTask = useCallback(() => {
    setEditingTask(null);
    setShowTaskForm(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  }, []);

  const handleSubmitTask = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      setFormLoading(true);

      if (editingTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(editingTask.id, data);
        setTasks((prev: Task[]) => prev.map((task: Task) => 
          task.id === editingTask.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await taskService.createTask(data as CreateTaskRequest);
        setTasks((prev: Task[]) => [newTask, ...prev]);
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks((prev: Task[]) => prev.map((task: Task) => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleReorderTasks = async (taskIds: string[]) => {
    try {
      await taskService.reorderTasks(taskIds);
      // Note: In a real app, you might want to reload tasks or update state optimistically
    } catch (err) {
      setError('Failed to reorder tasks. Please try again.');
      console.error('Error reordering tasks:', err);
    }
  };

  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortOptions({ field, order });
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    // Load users list for task assignment
    loadUsersList();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setTasks([]);
      setUsers([]);
    }
  };

  const loadUsersList = async () => {
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (err) {
      console.warn('Failed to load users list:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage 
          message={error} 
          onRetry={loadInitialData}
          className="max-w-md"
        />
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onCreateTask={handleCreateTask}
        onLogout={handleLogout}
      />

      <main>
        {/* Filters and Sort */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TaskFiltersComponent
                filters={filters}
                users={users}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
              
              <div className="flex-shrink-0">
                <TaskSort
                  sortField={sortOptions.field}
                  sortOrder={sortOptions.order}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ErrorMessage 
              message={error} 
              onRetry={loadTasks}
            />
          </div>
        )}

        {/* Task Board */}
        <div className="max-w-7xl mx-auto">
          <TaskBoard
            tasks={tasks}
            userRole={currentUser.role}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onReorderTasks={handleReorderTasks}
          />
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask || undefined}
          users={users}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};
