import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectUserName, selectUserRole, selectCanViewAuditLog } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/dashboard" class="text-xl font-bold text-gray-900">
              Task Manager
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8" *ngIf="isAuthenticated$ | async">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="text-blue-600" 
              class="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </a>
            <a 
              routerLink="/tasks" 
              routerLinkActive="text-blue-600" 
              class="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Tasks
            </a>
            <a 
              routerLink="/audit-log" 
              routerLinkActive="text-blue-600" 
              class="text-gray-700 hover:text-blue-600 transition-colors"
              *ngIf="canViewAuditLog$ | async"
            >
              Audit Log
            </a>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4" *ngIf="isAuthenticated$ | async">
            <div class="hidden md:block text-sm text-gray-700">
              <span class="font-medium">{{ userName$ | async }}</span>
              <span class="text-gray-500 ml-2">({{ userRole$ | async }})</span>
            </div>
            <button
              (click)="onLogout()"
              class="btn btn-outline"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden border-t border-gray-200" *ngIf="isAuthenticated$ | async">
          <div class="py-2 space-y-1">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-blue-50 text-blue-600" 
              class="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Dashboard
            </a>
            <a 
              routerLink="/tasks" 
              routerLinkActive="bg-blue-50 text-blue-600" 
              class="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Tasks
            </a>
            <a 
              routerLink="/audit-log" 
              routerLinkActive="bg-blue-50 text-blue-600" 
              class="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              *ngIf="canViewAuditLog$ | async"
            >
              Audit Log
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-between {
      justify-content: space-between;
    }
    .h-16 {
      height: 4rem;
    }
    .space-x-8 > * + * {
      margin-left: 2rem;
    }
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    .space-y-1 > * + * {
      margin-top: 0.25rem;
    }
    .text-xl {
      font-size: 1.25rem;
      line-height: 1.75rem;
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
    .text-gray-500 {
      color: #6b7280;
    }
    .text-blue-600 {
      color: #2563eb;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .bg-blue-50 {
      background-color: #eff6ff;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    .shadow-sm {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .border-b {
      border-bottom-width: 1px;
    }
    .border-t {
      border-top-width: 1px;
    }
    .border-gray-200 {
      border-color: #e5e7eb;
    }
    .rounded-md {
      border-radius: 0.375rem;
    }
    .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .ml-2 {
      margin-left: 0.5rem;
    }
    .hover\\:text-blue-600:hover {
      color: #2563eb;
    }
    .hover\\:bg-gray-50:hover {
      background-color: #f9fafb;
    }
    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    .hidden {
      display: none;
    }
    @media (min-width: 768px) {
      .md\\:flex {
        display: flex;
      }
      .md\\:block {
        display: block;
      }
      .md\\:hidden {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  userName$: Observable<string | null>;
  userRole$: Observable<string | null>;
  canViewAuditLog$: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userName$ = this.store.select(selectUserName);
    this.userRole$ = this.store.select(selectUserRole);
    this.canViewAuditLog$ = this.store.select(selectCanViewAuditLog);
  }

  ngOnInit(): void {}

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
