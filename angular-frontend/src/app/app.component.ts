import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ErrorBannerComponent } from './shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, ErrorBannerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <app-error-banner></app-error-banner>
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .min-h-screen {
      min-height: 100vh;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
    }
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
    .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Task Management Dashboard';
}
