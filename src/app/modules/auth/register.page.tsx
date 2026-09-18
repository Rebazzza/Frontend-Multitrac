import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type { ValidationError } from '../../models/validation-error.model';
import '../../shared/components/form-field.css';
import '../../shared/components/alert.css';
import './login.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationError>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await authService.register({ username, password, fullName, email });
      if (!response.success) {
        setError(response.message || 'Error al registrar');
        return;
      }
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.validationErrors) {
        setFieldErrors(apiError.validationErrors);
      } else {
        setError(apiError.message || 'Error al registrar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__brand">Atento Multitrac</h1>
          <p className="login-card__subtitle">Crear una cuenta</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username" className="form-field__label">
              Usuario <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            {fieldErrors.username && <span className="form-field__error">{fieldErrors.username[0]}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-field__label">
              Contraseña <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {fieldErrors.password && <span className="form-field__error">{fieldErrors.password[0]}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="fullName" className="form-field__label">Nombre completo</label>
            <div className="form-field__input">
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-field__label">Correo electrónico</label>
            <div className="form-field__input">
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="login-card__footer">
          <Link to="/login" className="login-card__link">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
