import './alert.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const TYPE_CLASSES: Record<AlertProps['type'], string> = {
  success: 'alert--success',
  error: 'alert--error',
  warning: 'alert--warning',
  info: 'alert--info',
};

export function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert ${TYPE_CLASSES[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="alert__close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
