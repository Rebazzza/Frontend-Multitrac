import { Routes, Route } from 'react-router-dom';
import { OperacionesPage } from './OperacionesPage';
import { FletesPage } from './FletesPage';

export function OperacionesRoutes() {
  return (
    <Routes>
      <Route index element={<OperacionesPage />} />
      <Route path='fletes' element={<FletesPage />} />
    </Routes>
  );
}

