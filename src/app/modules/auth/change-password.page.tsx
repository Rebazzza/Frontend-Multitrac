import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type { ValidationError } from '../../models/validation-error.model';
import '../../shared/components/form-field.css';
import '../../shared/components/alert.css';
import './login.css';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { forced?: boolean; username?: string } | null;
  const forced = Boolean(state?.forced);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationError>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: ValidationError = {};
    if (!currentPassword) errors.currentPassword = ['Ingrese su contraseña actual.'];
    if (!newPassword) errors.newPassword = ['Ingrese la nueva contraseña.'];
    if (newPassword.length < 6) errors.newPassword = ['La contraseña debe tener al menos 6 caracteres.'];
    if (newPassword !== confirmPassword) errors.confirmPassword = ['La confirmación no coincide con la nueva contraseña.'];
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword({ currentPassword, newPassword });
      if (!response.success) {
        setError(response.message || 'No se pudo cambiar la contraseña.');
        return;
      }
      setError('');
      if (response.token) {
        authService.setRemember(true);
        authService.setToken(response.token);
        if (response.fullName) authService.setFullName(response.fullName);
        if (response.roles) authService.setRoles(response.roles);
        if (response.username) authService.setUsername(response.username);
      }
      alert('Su Password ha sido Cambiado!');
      navigate(authService.getPostLoginRoute());
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

        {forced && (
          <div className="alert alert--warning">
            Por política de ciberseguridad, su contraseña debe ser cambiada cada 90 días. Es
            obligatorio actualizarla antes de continuar.
          </div>
        )}

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="currentPassword" className="form-field__label">
              Contraseña actual <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {fieldErrors.currentPassword && <span className="form-field__error">{fieldErrors.currentPassword[0]}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="newPassword" className="form-field__label">
              Nueva contraseña <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            {fieldErrors.newPassword && <span className="form-field__error">{fieldErrors.newPassword[0]}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-field__label">
              Confirmar nueva contraseña <span className="form-field__required">*</span>
            </label>
            <div className="form-field__input">
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            {fieldErrors.confirmPassword && <span className="form-field__error">{fieldErrors.confirmPassword[0]}</span>}
          </div>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}