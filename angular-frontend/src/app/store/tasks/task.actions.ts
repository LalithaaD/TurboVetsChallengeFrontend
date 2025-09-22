import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters, TaskSort, AuditLogEntry } from '../../models/task.model';

// Load Tasks
export const loadTasks = createAction(
  '[Tasks] Load Tasks',
  props<{ filters?: TaskFilters; sort?: TaskSort }>()
);

export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

// Load Single Task
export const loadTask = createAction(
  '[Tasks] Load Task',
  props<{ id: string }>()
);

export const loadTaskSuccess = createAction(
  '[Tasks] Load Task Success',
  props<{ task: Task }>()
);

export const loadTaskFailure = createAction(
  '[Tasks] Load Task Failure',
  props<{ error: string }>()
);

// Create Task
export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: CreateTaskRequest }>()
);

export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: Task }>()
);

export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: string }>()
);

// Update Task
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: string; updates: UpdateTaskRequest }>()
);

export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);

// Update Task Status
export const updateTaskStatus = createAction(
  '[Tasks] Update Task Status',
  props<{ id: string; status: string }>()
);

export const updateTaskStatusSuccess = createAction(
  '[Tasks] Update Task Status Success',
  props<{ task: Task }>()
);

export const updateTaskStatusFailure = createAction(
  '[Tasks] Update Task Status Failure',
  props<{ error: string }>()
);

// Filter and Sort
export const setTaskFilters = createAction(
  '[Tasks] Set Filters',
  props<{ filters: TaskFilters }>()
);

export const setTaskSort = createAction(
  '[Tasks] Set Sort',
  props<{ sort: TaskSort }>()
);

export const clearTaskFilters = createAction('[Tasks] Clear Filters');

// Select Task
export const selectTask = createAction(
  '[Tasks] Select Task',
  props<{ task: Task | null }>()
);

// Load Audit Log
export const loadAuditLog = createAction('[Tasks] Load Audit Log');

export const loadAuditLogSuccess = createAction(
  '[Tasks] Load Audit Log Success',
  props<{ auditLog: AuditLogEntry[] }>()
);

export const loadAuditLogFailure = createAction(
  '[Tasks] Load Audit Log Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearTaskError = createAction('[Tasks] Clear Error');
