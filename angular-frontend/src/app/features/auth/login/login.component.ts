import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { LoginRequest } from '../../../models/auth.model';
import { login } from '../../../store/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                formControlName="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="Email address"
                aria-describedby="email-error"
              />
              <div 
                *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                id="email-error"
                class="mt-1 text-sm text-red-600"
                role="alert"
              >
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>
            
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                formControlName="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Password"
                aria-describedby="password-error"
              />
              <div 
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                id="password-error"
                class="mt-1 text-sm text-red-600"
                role="alert"
              >
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || (isLoading$ | async)"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              [attr.aria-busy]="isLoading$ | async"
            >
              <span *ngIf="isLoading$ | async" class="loading-spinner mr-2"></span>
              <span *ngIf="isLoading$ | async">Signing in...</span>
              <span *ngIf="!(isLoading$ | async)">Sign in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .min-h-screen {
      min-height: 100vh;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    .py-12 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .max-w-md {
      max-width: 28rem;
    }
    .w-full {
      width: 100%;
    }
    .space-y-8 > * + * {
      margin-top: 2rem;
    }
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    .space-y-px > * + * {
      margin-top: -1px;
    }
    .mt-6 {
      margin-top: 1.5rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .mt-8 {
      margin-top: 2rem;
    }
    .mt-1 {
      margin-top: 0.25rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    .text-center {
      text-align: center;
    }
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .font-extrabold {
      font-weight: 800;
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
    .text-red-600 {
      color: #dc2626;
    }
    .text-white {
      color: #ffffff;
    }
    .text-blue-600 {
      color: #2563eb;
    }
    .hover\\:text-blue-500:hover {
      color: #3b82f6;
    }
    .bg-blue-600 {
      background-color: #2563eb;
    }
    .hover\\:bg-blue-700:hover {
      background-color: #1d4ed8;
    }
    .border {
      border-width: 1px;
    }
    .border-gray-300 {
      border-color: #d1d5db;
    }
    .border-red-500 {
      border-color: #ef4444;
    }
    .border-transparent {
      border-color: transparent;
    }
    .rounded-md {
      border-radius: 0.375rem;
    }
    .rounded-t-md {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }
    .rounded-b-md {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
    .rounded-none {
      border-radius: 0;
    }
    .shadow-sm {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .relative {
      position: relative;
    }
    .block {
      display: block;
    }
    .w-full {
      width: 100%;
    }
    .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .placeholder-gray-500::placeholder {
      color: #6b7280;
    }
    .focus\\:outline-none:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
    .focus\\:ring-blue-500:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .focus\\:border-blue-500:focus {
      border-color: #3b82f6;
    }
    .focus\\:z-10:focus {
      z-index: 10;
    }
    .focus\\:ring-2:focus {
      box-shadow: 0 0 0 2px var(--tw-ring-color);
    }
    .focus\\:ring-offset-2:focus {
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--tw-ring-color);
    }
    .focus\\:ring-blue-500:focus {
      --tw-ring-color: #3b82f6;
    }
    .group {
      position: relative;
    }
    .justify-center {
      justify-content: center;
    }
    .disabled\\:opacity-50:disabled {
      opacity: 0.5;
    }
    .disabled\\:cursor-not-allowed:disabled {
      cursor: not-allowed;
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
    @media (min-width: 640px) {
      .sm\\:px-6 {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
      .sm\\:text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
    @media (min-width: 1024px) {
      .lg\\:px-8 {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      this.store.dispatch(login({ credentials }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
