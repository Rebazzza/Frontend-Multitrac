import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import '../../shared/components/form-field.css';
import '../../shared/components/alert.css';
import './login.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registered = Boolean((location.state as { registered?: boolean } | null)?.registered);
  const [username, setUsername] = useState(
    authService.isRemembered() ? (authService.getUsername() ?? '') : '',
  );
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(authService.isRemembered());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password }, remember);
      if (!response.success) {
        setError(response.message || 'Su intento de acceso no tuvo éxito. Intente nuevamente.');
        return;
      }
      if (response.mustChangePassword) {
        navigate('/change-password', {
          state: { forced: true, username: response.username || username },
        });
        return;
      }
      navigate(authService.getPostLoginRoute());
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Su intento de acceso no tuvo éxito. Intente nuevamente.');
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

        {registered && <div className="alert alert--success">Usuario registrado correctamente. Inicie sesión.</div>}
        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username" className="form-field__label">
              NOMBRE USUARIO:
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
              CONTRASEÑA:
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
            <span className="login-card__remember-text">Recordarme la Próxima Vez.</span>
          </label>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'INICIAR SESION'}
          </button>
        </form>

        <div className="login-card__footer">
          <Link to="/register" className="login-card__link">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}