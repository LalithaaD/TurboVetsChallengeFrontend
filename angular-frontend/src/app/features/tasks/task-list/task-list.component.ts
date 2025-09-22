import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Task, TaskStatus, TaskPriority } from '../../../models/task.model';
import { selectSortedTasks, selectTasksLoading, selectTaskError } from '../../../store/tasks/task.selectors';
import { selectCanManageTasks, selectCanDeleteTasks, selectUserId } from '../../../store/auth/auth.selectors';
import { loadTasks, deleteTask, setTaskFilters, clearTaskFilters } from '../../../store/tasks/task.actions';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
        <div class="mt-4 sm:mt-0">
          <a
            routerLink="/tasks/new"
            class="btn btn-primary"
            *ngIf="canManageTasks$ | async"
          >
            Create New Task
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label for="status-filter" class="form-label">Status</label>
            <select
              id="status-filter"
              class="form-select"
              (change)="onStatusFilterChange($event)"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label for="priority-filter" class="form-label">Priority</label>
            <select
              id="priority-filter"
              class="form-select"
              (change)="onPriorityFilterChange($event)"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label for="assignee-filter" class="form-label">Assignee</label>
            <select
              id="assignee-filter"
              class="form-select"
              (change)="onAssigneeFilterChange($event)"
            >
              <option value="">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              <option value="me">Assigned to Me</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="onClearFilters()"
              class="btn btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading$ | async" class="text-center py-8">
        <div class="loading-spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading tasks...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading tasks</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div *ngIf="!(isLoading$ | async) && !(error$ | async)" class="space-y-4">
        <div *ngIf="(tasks$ | async)?.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          <div class="mt-6" *ngIf="canManageTasks$ | async">
            <a routerLink="/tasks/new" class="btn btn-primary">
              Create New Task
            </a>
          </div>
        </div>

        <div *ngFor="let task of tasks$ | async" class="bg-white shadow rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                <span class="badge" [ngClass]="getStatusBadgeClass(task.status)">
                  {{ task.status }}
                </span>
                <span class="badge" [ngClass]="getPriorityBadgeClass(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              
              <p class="mt-2 text-gray-600">{{ task.description }}</p>
              
              <div class="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span *ngIf="task.dueDate">
                  Due: {{ task.dueDate | date:'short' }}
                </span>
                <span *ngIf="task.assignedTo">
                  Assigned to: {{ task.assignedTo }}
                </span>
                <span>
                  Created: {{ task.createdAt | date:'short' }}
                </span>
              </div>

              <div *ngIf="task.tags?.length" class="mt-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let tag of task.tags"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="ml-4 flex space-x-2" *ngIf="canManageTasks$ | async">
              <a
                [routerLink]="['/tasks', task.id, 'edit']"
                class="btn btn-outline btn-sm"
                aria-label="Edit task"
              >
                Edit
              </a>
              <button
                *ngIf="canDeleteTasks$ | async"
                (click)="onDeleteTask(task.id)"
                class="btn btn-danger btn-sm"
                aria-label="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    .gap-2 > * + * {
      margin-left: 0.5rem;
    }
    .gap-4 > * + * {
      margin-left: 1rem;
    }
    .flex {
      display: flex;
    }
    .flex-col {
      flex-direction: column;
    }
    .flex-1 {
      flex: 1 1 0%;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .items-start {
      align-items: flex-start;
    }
    .items-center {
      align-items: center;
    }
    .items-end {
      align-items: flex-end;
    }
    .justify-between {
      justify-content: space-between;
    }
    .justify-center {
      justify-content: center;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .bg-red-50 {
      background-color: #fef2f2;
    }
    .bg-gray-100 {
      background-color: #f3f4f6;
    }
    .shadow {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .rounded-md {
      border-radius: 0.375rem;
    }
    .rounded-full {
      border-radius: 9999px;
    }
    .p-6 {
      padding: 1.5rem;
    }
    .p-4 {
      padding: 1rem;
    }
    .px-2\\.5 {
      padding-left: 0.625rem;
      padding-right: 0.625rem;
    }
    .py-0\\.5 {
      padding-top: 0.125rem;
      padding-bottom: 0.125rem;
    }
    .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .mt-3 {
      margin-top: 0.75rem;
    }
    .mt-4 {
      margin-top: 1rem;
    }
    .mt-6 {
      margin-top: 1.5rem;
    }
    .ml-3 {
      margin-left: 0.75rem;
    }
    .ml-4 {
      margin-left: 1rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .text-center {
      text-align: center;
    }
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }
    .font-bold {
      font-weight: 700;
    }
    .font-medium {
      font-weight: 500;
    }
    .text-gray-900 {
      color: #111827;
    }
    .text-gray-600 {
      color: #4b5563;
    }
    .text-gray-500 {
      color: #6b7280;
    }
    .text-gray-800 {
      color: #1f2937;
    }
    .text-red-400 {
      color: #f87171;
    }
    .text-red-700 {
      color: #b91c1c;
    }
    .text-red-800 {
      color: #991b1b;
    }
    .border {
      border-width: 1px;
    }
    .border-red-200 {
      border-color: #fecaca;
    }
    .grid {
      display: grid;
    }
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .h-5 {
      height: 1.25rem;
    }
    .w-5 {
      width: 1.25rem;
    }
    .h-12 {
      height: 3rem;
    }
    .w-12 {
      width: 3rem;
    }
    .flex-shrink-0 {
      flex-shrink: 0;
    }
    .inline-flex {
      display: inline-flex;
    }
    @media (min-width: 640px) {
      .sm\\:flex-row {
        flex-direction: row;
      }
      .sm\\:items-center {
        align-items: center;
      }
      .sm\\:justify-between {
        justify-content: space-between;
      }
      .sm\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .sm\\:mt-0 {
        margin-top: 0;
      }
    }
    @media (min-width: 1024px) {
      .lg\\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  canManageTasks$: Observable<boolean>;
  canDeleteTasks$: Observable<boolean>;
  userId$: Observable<string | null>;

  constructor(private store: Store) {
    this.tasks$ = this.store.select(selectSortedTasks);
    this.isLoading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTaskError);
    this.canManageTasks$ = this.store.select(selectCanManageTasks);
    this.canDeleteTasks$ = this.store.select(selectCanDeleteTasks);
    this.userId$ = this.store.select(selectUserId);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTasks({}));
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value || undefined;
    this.store.dispatch(setTaskFilters({ filters: { status: status as TaskStatus } }));
  }

  onPriorityFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const priority = target.value || undefined;
    this.store.dispatch(setTaskFilters({ filters: { priority: priority as TaskPriority } }));
  }

  onAssigneeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    let assignedTo: string | undefined;
    
    if (value === 'unassigned') {
      assignedTo = null;
    } else if (value === 'me') {
      // This would need to be combined with userId selector
      assignedTo = 'current-user';
    }
    
    this.store.dispatch(setTaskFilters({ filters: { assignedTo } }));
  }

  onClearFilters(): void {
    this.store.dispatch(clearTaskFilters());
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(deleteTask({ id: taskId }));
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'badge-info';
      case TaskStatus.IN_PROGRESS:
        return 'badge-warning';
      case TaskStatus.IN_REVIEW:
        return 'badge-info';
      case TaskStatus.DONE:
        return 'badge-success';
      case TaskStatus.CANCELLED:
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'badge-info';
      case TaskPriority.MEDIUM:
        return 'badge-warning';
      case TaskPriority.HIGH:
        return 'badge-danger';
      case TaskPriority.URGENT:
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
