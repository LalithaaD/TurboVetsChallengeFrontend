import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuditLogEntry } from '../../../models/task.model';
import { selectTasksLoading } from '../../../store/tasks/task.selectors';
import { loadAuditLog } from '../../../store/tasks/task.actions';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Audit Log</h1>
        <button
          (click)="onRefresh()"
          class="btn btn-outline"
          [disabled]="isLoading$ | async"
        >
          <span *ngIf="isLoading$ | async" class="loading-spinner mr-2"></span>
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading$ | async" class="text-center py-8">
        <div class="loading-spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading audit log...</p>
      </div>

      <!-- Audit Log Entries -->
      <div *ngIf="!(isLoading$ | async)" class="space-y-4">
        <div *ngIf="auditLog.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No audit log entries</h3>
          <p class="mt-1 text-sm text-gray-500">Activity will appear here as users interact with the system.</p>
        </div>

        <div *ngFor="let entry of auditLog" class="bg-white shadow rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <span class="badge" [ngClass]="getActionBadgeClass(entry.action)">
                  {{ entry.action }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ entry.entityType }} #{{ entry.entityId }}
                </span>
              </div>
              
              <div class="mt-2">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">{{ entry.userName }}</span>
                  performed {{ entry.action.toLowerCase() }} on {{ entry.entityType.toLowerCase() }}
                </p>
              </div>

              <div *ngIf="entry.changes" class="mt-3">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Changes:</h4>
                <div class="bg-gray-50 rounded-md p-3">
                  <pre class="text-xs text-gray-600 whitespace-pre-wrap">{{ formatChanges(entry.changes) }}</pre>
                </div>
              </div>

              <div class="mt-3 text-xs text-gray-500">
                {{ entry.timestamp | date:'medium' }}
              </div>
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
    .flex {
      display: flex;
    }
    .items-start {
      align-items: flex-start;
    }
    .items-center {
      align-items: center;
    }
    .justify-between {
      justify-content: space-between;
    }
    .justify-center {
      justify-content: center;
    }
    .flex-1 {
      flex: 1 1 0%;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
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
    .p-6 {
      padding: 1.5rem;
    }
    .p-3 {
      padding: 0.75rem;
    }
    .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    .mt-1 {
      margin-top: 0.25rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .mt-3 {
      margin-top: 0.75rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
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
    .text-gray-700 {
      color: #374151;
    }
    .text-gray-600 {
      color: #4b5563;
    }
    .text-gray-500 {
      color: #6b7280;
    }
    .text-gray-400 {
      color: #9ca3af;
    }
    .h-12 {
      height: 3rem;
    }
    .w-12 {
      width: 3rem;
    }
    .whitespace-pre-wrap {
      white-space: pre-wrap;
    }
  `]
})
export class AuditLogComponent implements OnInit {
  auditLog: AuditLogEntry[] = [];
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(selectTasksLoading);
  }

  ngOnInit(): void {
    this.loadAuditLog();
  }

  loadAuditLog(): void {
    this.store.dispatch(loadAuditLog());
    
    // Subscribe to audit log data
    // Note: This would need to be added to the task selectors
    // For now, we'll simulate the data
    this.auditLog = [
      {
        id: '1',
        action: 'CREATE',
        entityType: 'Task',
        entityId: 'task-123',
        userId: 'user-1',
        userName: 'John Doe',
        changes: { title: 'New Task', status: 'TODO' },
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        action: 'UPDATE',
        entityType: 'Task',
        entityId: 'task-123',
        userId: 'user-2',
        userName: 'Jane Smith',
        changes: { status: 'IN_PROGRESS' },
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  onRefresh(): void {
    this.loadAuditLog();
  }

  getActionBadgeClass(action: string): string {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'badge-success';
      case 'UPDATE':
        return 'badge-warning';
      case 'DELETE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  formatChanges(changes: any): string {
    return JSON.stringify(changes, null, 2);
  }
}
