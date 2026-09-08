import httpService from './http.service';
import { TOKEN_KEY } from '../interceptors/jwt.interceptor';
import type { AuthResponse } from '../../models/auth-response.model';
import type { Credentials, RegisterCredentials, ChangePasswordCredentials } from '../../models/credentials.model';
import type { UsuarioDto } from '../../models/usuario.model';

const FULLNAME_KEY = 'auth_fullname';
const ROLES_KEY = 'auth_roles';

export const authService = {
  async login(credentials: Credentials): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/login', credentials);
    if (data.success && data.token) {
      this.setToken(data.token);
      this.setFullName(data.fullName);
      this.setRoles(data.roles);
    }
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/register', credentials);
    if (data.success && data.token) {
      this.setToken(data.token);
      this.setFullName(data.fullName);
      this.setRoles(data.roles);
    }
    return data;
  },

  async changePassword(credentials: ChangePasswordCredentials): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/change-password', credentials);
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getMe(): Promise<UsuarioDto> {
    const { data } = await httpService.get<UsuarioDto>('/auth/me');
    return data;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setFullName(fullName: string): void {
    localStorage.setItem(FULLNAME_KEY, fullName);
  },

  getFullName(): string | null {
    return localStorage.getItem(FULLNAME_KEY);
  },

  setRoles(roles: string[]): void {
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  },

  getRoles(): string[] {
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(FULLNAME_KEY);
    localStorage.removeItem(ROLES_KEY);
  },
};
