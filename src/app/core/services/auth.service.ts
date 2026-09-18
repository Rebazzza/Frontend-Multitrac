import httpService from './http.service';
import { TOKEN_KEY } from '../interceptors/jwt.interceptor';
import type { AuthResponse } from '../../models/auth-response.model';
import type { Credentials, RegisterCredentials, ChangePasswordCredentials } from '../../models/credentials.model';
import type { UsuarioDto } from '../../models/usuario.model';

const FULLNAME_KEY = 'auth_fullname';
const ROLES_KEY = 'auth_roles';
const USERNAME_KEY = 'auth_username';
const REMEMBER_KEY = 'auth_remember';

export const authService = {
  async login(credentials: Credentials, remember: boolean): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/login', credentials);
    if (data.success && data.token) {
      this.setRemember(remember);
      this.setToken(data.token);
      this.setFullName(data.fullName ?? '');
      this.setRoles(data.roles ?? []);
      this.setUsername(data.username || credentials.username);
    }
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  async changePassword(credentials: ChangePasswordCredentials): Promise<AuthResponse> {
    const { data } = await httpService.post<AuthResponse>('/auth/change-password', credentials);
    return data;
  },

  async getMe(): Promise<UsuarioDto> {
    const { data } = await httpService.get<UsuarioDto>('/auth/me');
    return data;
  },

  setRemember(remember: boolean): void {
    localStorage.setItem(REMEMBER_KEY, String(remember));
  },

  isRemembered(): boolean {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  },

  setToken(token: string): void {
    const storage = this.isRemembered() ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
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

  setUsername(username: string): void {
    localStorage.setItem(USERNAME_KEY, username);
  },

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      if (expiresAt <= Date.now()) return false;
      this.setRemember(true);
      return true;
    } catch {
      return false;
    }
  },

  /** Ruta post-autenticacion segun rol (SF-006). */
  getPostLoginRoute(): string {
    const roles = this.getRoles();
    if (roles.some((r) => /admin|administrador/i.test(r))) return '/';
    return '/';
  },

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(FULLNAME_KEY);
    localStorage.removeItem(ROLES_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  },
};