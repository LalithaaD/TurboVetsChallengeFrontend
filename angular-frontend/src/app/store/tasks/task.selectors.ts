import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, TaskStatus, TaskPriority } from '../../models/task.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.selectedTask
);

export const selectTaskFilters = createSelector(
  selectTaskState,
  (state: TaskState) => state.filters
);

export const selectTaskSort = createSelector(
  selectTaskState,
  (state: TaskState) => state.sort
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.isLoading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

// Filtered Tasks
export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.createdBy && task.createdBy !== filters.createdBy) return false;
      if (filters.isPublic !== undefined && task.isPublic !== filters.isPublic) return false;
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => task.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }
);

// Sorted Tasks
export const selectSortedTasks = createSelector(
  selectFilteredTasks,
  selectTaskSort,
  (tasks, sort) => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle date fields
      if (sort.field === 'dueDate' || sort.field === 'createdAt' || sort.field === 'updatedAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }
);

// Task Statistics
export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => {
    const total = tasks.length;
    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    const overdue = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
    }).length;

    return {
      total,
      byStatus,
      byPriority,
      overdue
    };
  }
);

// Tasks by Status
export const selectTasksByStatus = createSelector(
  selectSortedTasks,
  (tasks) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, any[]>);
  }
);

// My Tasks (created by current user)
export const selectMyTasks = createSelector(
  selectSortedTasks,
  (tasks) => {
    // This would need to be combined with auth selector in component
    return tasks;
  }
);

// Assigned Tasks
export const selectAssignedTasks = createSelector(
  selectSortedTasks,
  (tasks) => {
    // This would need to be combined with auth selector in component
    return tasks;
  }
);
