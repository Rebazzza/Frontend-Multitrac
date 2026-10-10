import { Routes, Route } from 'react-router-dom';
import { EquiposPage } from './EquiposPage';

export function EquiposRoutes() {
  return (
    <Routes>
      <Route index element={<EquiposPage />} />
    </Routes>
  );
}
