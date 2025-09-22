import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectUserName, selectUserRole, selectIsOwner, selectIsAdmin, selectIsViewer } from '../../store/auth/auth.selectors';
import { selectTaskStats, selectTasksLoading } from '../../store/tasks/task.selectors';
import { loadTasks } from '../../store/tasks/task.actions';
import { TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {{ userName$ | async }}!
          </h1>
          <p class="text-gray-600">
            You are logged in as <span class="font-medium">{{ userRole$ | async }}</span>
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              routerLink="/tasks/new"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  Create New Task
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Add a new task to your project
                </p>
              </div>
            </a>

            <a
              routerLink="/tasks"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  View All Tasks
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Manage and organize your tasks
                </p>
              </div>
            </a>

            <a
              *ngIf="canViewAuditLog$ | async"
              routerLink="/audit-log"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  Audit Log
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  View system activity and changes
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Task Statistics -->
      <div class="bg-white shadow rounded-lg" *ngIf="taskStats$ | async as stats">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Task Statistics</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.total }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.byStatus['DONE'] || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.byStatus['IN_PROGRESS'] || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.overdue }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Role-based Information -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Your Permissions</h2>
          <div class="space-y-3">
            <div class="flex items-center" *ngIf="isOwner$ | async">
              <svg class="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-700">Full access to all features and data</span>
            </div>
            <div class="flex items-center" *ngIf="isAdmin$ | async">
              <svg class="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-700">Can create, edit, and manage tasks</span>
            </div>
            <div class="flex items-center" *ngIf="isViewer$ | async">
              <svg class="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-700">Read-only access to view tasks</span>
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
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    .bg-blue-50 {
      background-color: #eff6ff;
    }
    .bg-green-50 {
      background-color: #f0fdf4;
    }
    .bg-purple-50 {
      background-color: #faf5ff;
    }
    .overflow-hidden {
      overflow: hidden;
    }
    .shadow {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .py-5 {
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
    }
    .p-6 {
      padding: 1.5rem;
    }
    .p-5 {
      padding: 1.25rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .mr-3 {
      margin-right: 0.75rem;
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
    .font-bold {
      font-weight: 700;
    }
    .font-medium {
      font-weight: 500;
    }
    .text-gray-900 {
      color: #111827;
    }
    .text-gray-700 {
      color: #374151;
    }
    .text-gray-600 {
      color: #4b5563;
    }
    .text-gray-500 {
      color: #6b7280;
    }
    .text-blue-700 {
      color: #1d4ed8;
    }
    .text-green-700 {
      color: #15803d;
    }
    .text-purple-700 {
      color: #7c3aed;
    }
    .text-green-400 {
      color: #4ade80;
    }
    .text-yellow-400 {
      color: #facc15;
    }
    .text-red-400 {
      color: #f87171;
    }
    .text-gray-400 {
      color: #9ca3af;
    }
    .grid {
      display: grid;
    }
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .gap-4 {
      gap: 1rem;
    }
    .gap-5 {
      gap: 1.25rem;
    }
    .relative {
      position: relative;
    }
    .group {
      position: relative;
    }
    .focus-within\\:ring-2:focus-within {
      box-shadow: 0 0 0 2px var(--tw-ring-color);
    }
    .focus-within\\:ring-inset:focus-within {
      box-shadow: inset 0 0 0 2px var(--tw-ring-color);
    }
    .focus-within\\:ring-blue-500:focus-within {
      --tw-ring-color: #3b82f6;
    }
    .border {
      border-width: 1px;
    }
    .border-gray-300 {
      border-color: #d1d5db;
    }
    .hover\\:border-gray-400:hover {
      border-color: #9ca3af;
    }
    .inline-flex {
      display: inline-flex;
    }
    .ring-4 {
      box-shadow: 0 0 0 4px var(--tw-ring-color);
    }
    .ring-white {
      --tw-ring-color: #ffffff;
    }
    .h-6 {
      height: 1.5rem;
    }
    .w-6 {
      width: 1.5rem;
    }
    .h-5 {
      height: 1.25rem;
    }
    .w-5 {
      width: 1.25rem;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .flex-shrink-0 {
      flex-shrink: 0;
    }
    .flex-1 {
      flex: 1 1 0%;
    }
    .w-0 {
      width: 0;
    }
    .ml-5 {
      margin-left: 1.25rem;
    }
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .absolute {
      position: absolute;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    @media (min-width: 640px) {
      .sm\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .sm\\:p-6 {
        padding: 1.5rem;
      }
    }
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .lg\\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName$: Observable<string | null>;
  userRole$: Observable<string | null>;
  isOwner$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isViewer$: Observable<boolean>;
  canViewAuditLog$: Observable<boolean>;
  taskStats$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.userName$ = this.store.select(selectUserName);
    this.userRole$ = this.store.select(selectUserRole);
    this.isOwner$ = this.store.select(selectIsOwner);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.isViewer$ = this.store.select(selectIsViewer);
    this.canViewAuditLog$ = this.store.select(selectCanViewAuditLog);
    this.taskStats$ = this.store.select(selectTaskStats);
    this.isLoading$ = this.store.select(selectTasksLoading);
  }

  ngOnInit(): void {
    // Load tasks to get statistics
    this.store.dispatch(loadTasks({}));
  }
}
