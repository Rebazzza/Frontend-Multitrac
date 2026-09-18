import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/auth.service';
import type { ErrorResponse } from '../../models/error-response.model';
import type { ValidationError } from '../../models/validation-error.model';

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  validationErrors?: ValidationError;
}

function parseApiError(error: AxiosError<ErrorResponse>): ApiError {
  const response = error.response;
  if (!response) {
    return { status: 0, message: 'Error de conexión. Verifique su red.', timestamp: new Date().toISOString() };
  }

  const data = response.data;
  const status = response.status;
  const apiError: ApiError = {
    status,
    message: data?.message || 'Error desconocido',
    timestamp: data?.timestamp || new Date().toISOString(),
  };

  if (status === 400 && data?.message) {
    try {
      apiError.validationErrors = JSON.parse(data.message) as ValidationError;
      apiError.message = 'Error de validación';
    } catch {
      // message no es JSON de validación, dejarlo como está
    }
  }

  return apiError;
}

export function applyErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
      const apiError = parseApiError(error);
      const url = error.config?.url ?? '';

      // 401 en login/register = credenciales invalidas, NO sesion expirada.
      const isAuthEndpoint = /\/auth\/(login|register)$/i.test(url);

      if (apiError.status === 401 && !isAuthEndpoint) {
        authService.logout();
        window.location.href = '/login';
      }

      return Promise.reject(apiError);
    },
  );

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error) => Promise.reject(error),
  );
}
