import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import '../../shared/components/form-field.css';
import '../../shared/components/alert.css';
import './login.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      if (!response.success) {
        setError(response.message || 'Credenciales incorrectas');
        return;
      }
      navigate('/catalogos/monedas');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__brand">Atento Multitrac</h1>
          <p className="login-card__subtitle">Sistema de Control</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username" className="form-field__label">
              UserName:
            </label>
            <div className="form-field__input">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-field__label">
              Password:
            </label>
            <div className="form-field__input">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <label className="login-card__remember">
            <input
              type="checkbox"
              className="login-card__remember-input"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="login-card__check" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="login-card__remember-text">Mantenme Conectado</span>
          </label>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-card__footer">
          <Link to="/register" className="login-card__link">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}