import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { TaskService } from '../../core/services/task.service';
import * as TaskActions from './task.actions';
import { selectTaskFilters, selectTaskSort } from './task.selectors';
import { AppState } from '../index';

@Injectable()
export class TaskEffects {
  
  // Load Tasks Effect
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      withLatestFrom(
        this.store.select(selectTaskFilters),
        this.store.select(selectTaskSort)
      ),
      switchMap(([action, filters, sort]) =>
        this.taskService.getTasks(filters, sort).pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) => of(TaskActions.loadTasksFailure({ 
            error: error.error?.message || 'Failed to load tasks' 
          })))
        )
      )
    )
  );

  // Load Single Task Effect
  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTask),
      switchMap(({ id }) =>
        this.taskService.getTask(id).pipe(
          map((task) => TaskActions.loadTaskSuccess({ task })),
          catchError((error) => of(TaskActions.loadTaskFailure({ 
            error: error.error?.message || 'Failed to load task' 
          })))
        )
      )
    )
  );

  // Create Task Effect
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      switchMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError((error) => of(TaskActions.createTaskFailure({ 
            error: error.error?.message || 'Failed to create task' 
          })))
        )
      )
    )
  );

  // Create Task Success Effect
  createTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTaskSuccess),
      tap(() => this.router.navigate(['/tasks']))
    ),
    { dispatch: false }
  );

  // Update Task Effect
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ id, updates }) =>
        this.taskService.updateTask(id, updates).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error) => of(TaskActions.updateTaskFailure({ 
            error: error.error?.message || 'Failed to update task' 
          })))
        )
      )
    )
  );

  // Update Task Success Effect
  updateTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskSuccess),
      tap(() => this.router.navigate(['/tasks']))
    ),
    { dispatch: false }
  );

  // Delete Task Effect
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) => of(TaskActions.deleteTaskFailure({ 
            error: error.error?.message || 'Failed to delete task' 
          })))
        )
      )
    )
  );

  // Update Task Status Effect
  updateTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskStatus),
      switchMap(({ id, status }) =>
        this.taskService.updateTaskStatus(id, status).pipe(
          map((task) => TaskActions.updateTaskStatusSuccess({ task })),
          catchError((error) => of(TaskActions.updateTaskStatusFailure({ 
            error: error.error?.message || 'Failed to update task status' 
          })))
        )
      )
    )
  );

  // Load Audit Log Effect
  loadAuditLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadAuditLog),
      switchMap(() =>
        this.taskService.getAuditLog().pipe(
          map((auditLog) => TaskActions.loadAuditLogSuccess({ auditLog })),
          catchError((error) => of(TaskActions.loadAuditLogFailure({ 
            error: error.error?.message || 'Failed to load audit log' 
          })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskService: TaskService,
    private store: Store<AppState>,
    private router: Router
  ) {}
}
