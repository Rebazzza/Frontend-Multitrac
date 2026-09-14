import { Route, Routes } from 'react-router-dom';
import { SuenoPage } from './SuenoPage';

export function SuenoRoutes() {
  return (
    <Routes>
      <Route index element={<SuenoPage />} />
    </Routes>
  );
}