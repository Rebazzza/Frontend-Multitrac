import { useState } from 'react';
import { Modal } from '../../shared/components/modal';
import { FormField } from '../../shared/components/form-field';
import { Alert } from '../../shared/components/alert';
import type { FieldConfig } from './catalog-config';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type { ValidationError } from '../../models/validation-error.model';
import '../../shared/components/form-field.css';
import './catalog-form.css';

interface CatalogFormProps {
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, unknown> | null;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

export function CatalogForm({ title, fields, initialValues, onSubmit, onCancel }: CatalogFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const field of fields) {
      initial[field.key] = (initialValues?.[field.key] as string | number | undefined) ?? (field.type === 'number' ? '' : '');
    }
    return initial;
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationError>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const processed: Record<string, unknown> = {};
      for (const field of fields) {
        const val = values[field.key];
        if (field.type === 'number' && val !== '') {
          processed[field.key] = Number(val);
        } else if (field.type === 'number' && val === '') {
          processed[field.key] = null;
        } else {
          processed[field.key] = val || null;
        }
      }
      await onSubmit(processed);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.validationErrors) {
        setFieldErrors(apiError.validationErrors);
      } else {
        setError(apiError.message || 'Error al guardar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen title={title} onClose={onCancel}>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <FormField
            key={field.key}
            label={field.label}
            name={field.key}
            required={field.required}
            error={fieldErrors[field.key]?.[0]}
          >
            {field.type === 'select' ? (
              <select
                id={field.key}
                value={String(values[field.key] ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={field.key}
                type={field.type || 'text'}
                value={String(values[field.key] ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </FormField>
        ))}

        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
