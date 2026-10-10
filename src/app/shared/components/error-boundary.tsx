import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('ErrorBoundary capturo un error:', error, info?.componentStack ?? '');
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 24,
            background: '#0b131f',
            color: '#ecf0f1',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 24 }}>Algo salio mal</h1>
          <p style={{ margin: 0, maxWidth: 640, color: '#aeb6bf' }}>
            {this.state.error?.message ?? 'Error inesperado en la aplicacion.'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid #34495e',
                background: '#1a2634',
                color: '#ecf0f1',
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#2980b9',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Recargar pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
