import { createReducer, on } from '@ngrx/store';
import { TaskState, TaskFilters, TaskSort, TaskStatus, TaskPriority } from '../../models/task.model';
import * as TaskActions from './task.actions';

export const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
  isLoading: false,
  error: null
};

export const taskReducer = createReducer(
  initialState,
  
  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Load Single Task
  on(TaskActions.loadTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.loadTaskSuccess, (state, { task }) => ({
    ...state,
    selectedTask: task,
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.loadTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Update Task Status
  on(TaskActions.updateTaskStatus, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(TaskActions.updateTaskStatusSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    isLoading: false,
    error: null
  })),
  
  on(TaskActions.updateTaskStatusFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Filter and Sort
  on(TaskActions.setTaskFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  })),
  
  on(TaskActions.setTaskSort, (state, { sort }) => ({
    ...state,
    sort
  })),
  
  on(TaskActions.clearTaskFilters, (state) => ({
    ...state,
    filters: {}
  })),
  
  // Select Task
  on(TaskActions.selectTask, (state, { task }) => ({
    ...state,
    selectedTask: task
  })),
  
  // Clear Error
  on(TaskActions.clearTaskError, (state) => ({
    ...state,
    error: null
  }))
);
