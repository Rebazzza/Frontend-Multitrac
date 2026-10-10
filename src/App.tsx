import { ErrorBoundary } from './app/shared/components/error-boundary';
import { AppRoutes } from './app/app.routes';

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
