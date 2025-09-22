import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || null
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id || null
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email || null
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : null
);

export const selectOrganizationId = createSelector(
  selectUser,
  (user) => user?.organizationId || null
);

// Role-based selectors
export const selectIsOwner = createSelector(
  selectUserRole,
  (role) => role === 'owner'
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'admin'
);

export const selectIsViewer = createSelector(
  selectUserRole,
  (role) => role === 'viewer'
);

export const selectCanManageTasks = createSelector(
  selectUserRole,
  (role) => ['owner', 'admin'].includes(role || '')
);

export const selectCanDeleteTasks = createSelector(
  selectUserRole,
  (role) => role === 'owner'
);

export const selectCanViewAuditLog = createSelector(
  selectUserRole,
  (role) => ['owner', 'admin'].includes(role || '')
);
