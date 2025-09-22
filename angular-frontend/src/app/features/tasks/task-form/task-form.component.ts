import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '../../../models/task.model';
import { selectSelectedTask, selectTasksLoading } from '../../../store/tasks/task.selectors';
import { createTask, updateTask, loadTask } from '../../../store/tasks/task.actions';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
        </h1>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="form-label">Title *</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                class="form-input"
                [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
                placeholder="Enter task title"
                aria-describedby="title-error"
              />
              <div 
                *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" 
                id="title-error"
                class="error-message"
                role="alert"
              >
                <span *ngIf="taskForm.get('title')?.errors?.['required']">Title is required</span>
                <span *ngIf="taskForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters</span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="form-label">Description *</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-textarea"
                [class.error]="taskForm.get('description')?.invalid && taskForm.get('description')?.touched"
                placeholder="Enter task description"
                rows="4"
                aria-describedby="description-error"
              ></textarea>
              <div 
                *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched" 
                id="description-error"
                class="error-message"
                role="alert"
              >
                <span *ngIf="taskForm.get('description')?.errors?.['required']">Description is required</span>
                <span *ngIf="taskForm.get('description')?.errors?.['minlength']">Description must be at least 10 characters</span>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label for="priority" class="form-label">Priority *</label>
              <select
                id="priority"
                formControlName="priority"
                class="form-select"
                [class.error]="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched"
                aria-describedby="priority-error"
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <div 
                *ngIf="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched" 
                id="priority-error"
                class="error-message"
                role="alert"
              >
                <span *ngIf="taskForm.get('priority')?.errors?.['required']">Priority is required</span>
              </div>
            </div>

            <!-- Due Date -->
            <div>
              <label for="dueDate" class="form-label">Due Date</label>
              <input
                id="dueDate"
                type="date"
                formControlName="dueDate"
                class="form-input"
                aria-describedby="dueDate-help"
              />
              <p id="dueDate-help" class="mt-1 text-sm text-gray-500">
                Optional due date for this task
              </p>
            </div>

            <!-- Visibility -->
            <div>
              <fieldset>
                <legend class="form-label">Visibility</legend>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center">
                    <input
                      id="public"
                      type="radio"
                      formControlName="isPublic"
                      [value]="true"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label for="public" class="ml-2 text-sm text-gray-700">
                      Public - Visible to all team members
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="private"
                      type="radio"
                      formControlName="isPublic"
                      [value]="false"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label for="private" class="ml-2 text-sm text-gray-700">
                      Private - Only visible to you and assignee
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="form-label">Tags</label>
              <input
                id="tags"
                type="text"
                formControlName="tags"
                class="form-input"
                placeholder="Enter tags separated by commas (e.g., frontend, bug, urgent)"
                aria-describedby="tags-help"
              />
              <p id="tags-help" class="mt-1 text-sm text-gray-500">
                Separate multiple tags with commas
              </p>
            </div>

            <!-- Assignee -->
            <div>
              <label for="assignedTo" class="form-label">Assignee</label>
              <input
                id="assignedTo"
                type="text"
                formControlName="assignedTo"
                class="form-input"
                placeholder="Enter assignee username or email"
                aria-describedby="assignedTo-help"
              />
              <p id="assignedTo-help" class="mt-1 text-sm text-gray-500">
                Optional - assign this task to a team member
              </p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              (click)="onCancel()"
              class="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid || (isLoading$ | async)"
              class="btn btn-primary"
              [attr.aria-busy]="isLoading$ | async"
            >
              <span *ngIf="isLoading$ | async" class="loading-spinner mr-2"></span>
              <span *ngIf="isLoading$ | async">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
              <span *ngIf="!(isLoading$ | async)">{{ isEditMode ? 'Update Task' : 'Create Task' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .max-w-2xl {
      max-width: 42rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .shadow {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .p-6 {
      padding: 1.5rem;
    }
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
    .mt-1 {
      margin-top: 0.25rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .mt-6 {
      margin-top: 1.5rem;
    }
    .mt-8 {
      margin-top: 2rem;
    }
    .ml-2 {
      margin-left: 0.5rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .font-bold {
      font-weight: 700;
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
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-end {
      justify-content: flex-end;
    }
    .h-4 {
      height: 1rem;
    }
    .w-4 {
      width: 1rem;
    }
    .text-blue-600 {
      color: #2563eb;
    }
    .focus\\:ring-blue-500:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .border-gray-300 {
      border-color: #d1d5db;
    }
    .rows-4 {
      rows: 4;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isLoading$: Observable<boolean>;
  isEditMode = false;
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['', Validators.required],
      dueDate: [''],
      isPublic: [true],
      tags: [''],
      assignedTo: ['']
    });

    this.isLoading$ = this.store.select(selectTasksLoading);
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.store.dispatch(loadTask({ id: this.taskId }));
      
      // Subscribe to selected task to populate form
      this.store.select(selectSelectedTask).subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            isPublic: task.isPublic,
            tags: task.tags?.join(', ') || '',
            assignedTo: task.assignedTo || ''
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      // Process tags
      const tags = formValue.tags 
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      // Process due date
      const dueDate = formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined;

      if (this.isEditMode && this.taskId) {
        const updateData: UpdateTaskRequest = {
          title: formValue.title,
          description: formValue.description,
          priority: formValue.priority,
          dueDate,
          isPublic: formValue.isPublic,
          tags,
          assignedTo: formValue.assignedTo || undefined
        };
        
        this.store.dispatch(updateTask({ id: this.taskId, updates: updateData }));
      } else {
        const createData: CreateTaskRequest = {
          title: formValue.title,
          description: formValue.description,
          priority: formValue.priority,
          dueDate,
          isPublic: formValue.isPublic,
          tags,
          assignedTo: formValue.assignedTo || undefined
        };
        
        this.store.dispatch(createTask({ task: createData }));
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
