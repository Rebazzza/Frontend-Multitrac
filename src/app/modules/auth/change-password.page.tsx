import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type { ValidationError } from '../../models/validation-error.model';
import '../../shared/components/form-field.css';
import '../../shared/components/alert.css';
import './login.css';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationError>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await authService.changePassword({ currentPassword, newPassword });
      if (!response.success) {
        setError(response.message || 'Error al cambiar contraseña');
        return;
      }
      navigate('/catalogos/monedas');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.validationErrors) {
        setFieldErrors(apiError.validationErrors);
      } else {
        setError(apiError.message || 'Error al cambiar contraseña');
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
          <p className="login-card__subtitle">Cambiar contraseña</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="currentPassword" className="form-field__label">
              Contraseña actual <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            {fieldErrors.currentPassword && <span className="form-field__error">{fieldErrors.currentPassword[0]}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="newPassword" className="form-field__label">
              Nueva contraseña <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            {fieldErrors.newPassword && <span className="form-field__error">{fieldErrors.newPassword[0]}</span>}
          </div>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
