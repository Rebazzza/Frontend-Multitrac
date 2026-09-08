import type { ReactNode } from 'react';
import './form-field.css';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, name, error, required, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-field__label">
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      <div className="form-field__input">
        {children}
      </div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
