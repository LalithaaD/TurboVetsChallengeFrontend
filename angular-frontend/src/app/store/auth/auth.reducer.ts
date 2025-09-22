import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../models/auth.model';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { response }) => {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return {
      ...state,
      user: response.user,
      token: response.access_token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
  }),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
    user: null,
    token: null
  })),
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.registerSuccess, (state, { response }) => {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return {
      ...state,
      user: response.user,
      token: response.access_token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
  }),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
    user: null,
    token: null
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.logoutSuccess, (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };
  }),
  
  // Profile
  on(AuthActions.loadProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
    user: null,
    token: null
  })),
  
  // Token Refresh
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { token }) => {
    localStorage.setItem('token', token);
    return {
      ...state,
      token,
      isLoading: false,
      error: null
    };
  }),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error
    };
  }),
  
  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null
  }))
);
