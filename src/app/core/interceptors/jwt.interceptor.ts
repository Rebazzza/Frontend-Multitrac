import type { AxiosInstance } from 'axios';
import { authService } from '../services/auth.service';

const TOKEN_KEY = 'auth_token';

export function applyJwtInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export { TOKEN_KEY };
