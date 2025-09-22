import { AuthResponse, LoginRequest, User } from '../types';

// Demo authentication service that simulates JWT authentication
// This allows you to test the authentication flow without a backend

class DemoAuthService {
  private token: string | null = null;
  private demoUsers: User[] = [
    {
      id: '1',
      name: 'John Owner',
      email: 'owner@example.com',
      role: 'owner'
    },
    {
      id: '2', 
      name: 'Jane Admin',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      id: '3',
      name: 'Bob Viewer', 
      email: 'viewer@example.com',
      role: 'viewer'
    }
  ];

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = this.demoUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password (in demo, all passwords are 'pass123')
    if (credentials.password !== 'pass123') {
      throw new Error('Invalid email or password');
    }

    // Generate a mock JWT token
    const mockToken = this.generateMockToken(user);
    
    // Store token and user data
    this.setToken(mockToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return {
      token: mockToken,
      user: user
    };
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Clear local storage
    this.clearAuth();
  }

  async refreshToken(): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }
    
    const newToken = this.generateMockToken(user);
    this.setToken(newToken);
    return newToken;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearAuth(): void {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Helper method to get authorization header
  getAuthHeader(): { Authorization: string } | {} {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // Helper method to decode JWT token (client-side only, for demo purposes)
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      const decoded = this.decodeToken(this.token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Generate a mock JWT token for demo purposes
  private generateMockToken(user: User): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    // Simple base64 encoding for demo (not secure for production)
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa('demo-signature');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}

export const authService = new DemoAuthService();
