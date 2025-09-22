import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { selectAuthError } from '../../../store/auth/auth.selectors';
import { selectTaskError } from '../../../store/tasks/task.selectors';
import { clearAuthError } from '../../../store/auth/auth.actions';
import { clearTaskError } from '../../../store/tasks/task.actions';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="errorMessage$ | async as errorMessage" 
      class="bg-red-50 border-l-4 border-red-400 p-4 mb-4"
      role="alert"
      aria-live="polite"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ errorMessage }}
          </p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              (click)="onDismiss()"
              class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              aria-label="Dismiss error"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-red-50 {
      background-color: #fef2f2;
    }
    .border-l-4 {
      border-left-width: 4px;
    }
    .border-red-400 {
      border-color: #f87171;
    }
    .p-4 {
      padding: 1rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .flex {
      display: flex;
    }
    .flex-shrink-0 {
      flex-shrink: 0;
    }
    .ml-3 {
      margin-left: 0.75rem;
    }
    .ml-auto {
      margin-left: auto;
    }
    .pl-3 {
      padding-left: 0.75rem;
    }
    .-mx-1\\.5 {
      margin-left: -0.375rem;
      margin-right: -0.375rem;
    }
    .-my-1\\.5 {
      margin-top: -0.375rem;
      margin-bottom: -0.375rem;
    }
    .inline-flex {
      display: inline-flex;
    }
    .rounded-md {
      border-radius: 0.375rem;
    }
    .p-1\\.5 {
      padding: 0.375rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .text-red-700 {
      color: #b91c1c;
    }
    .text-red-500 {
      color: #ef4444;
    }
    .text-red-400 {
      color: #f87171;
    }
    .hover\\:bg-red-100:hover {
      background-color: #fee2e2;
    }
    .h-5 {
      height: 1.25rem;
    }
    .w-5 {
      width: 1.25rem;
    }
    .h-3 {
      height: 0.75rem;
    }
    .w-3 {
      width: 0.75rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .focus\\:outline-none:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
    .focus\\:ring-2:focus {
      box-shadow: 0 0 0 2px var(--tw-ring-color);
    }
    .focus\\:ring-offset-2:focus {
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--tw-ring-color);
    }
    .focus\\:ring-offset-red-50:focus {
      --tw-ring-offset-color: #fef2f2;
    }
    .focus\\:ring-red-600:focus {
      --tw-ring-color: #dc2626;
    }
  `]
})
export class ErrorBannerComponent implements OnInit {
  errorMessage$: Observable<string | null>;

  constructor(private store: Store) {
    this.errorMessage$ = combineLatest([
      this.store.select(selectAuthError),
      this.store.select(selectTaskError)
    ]).pipe(
      map(([authError, taskError]) => authError || taskError)
    );
  }

  ngOnInit(): void {}

  onDismiss(): void {
    this.store.dispatch(clearAuthError());
    this.store.dispatch(clearTaskError());
  }
}
