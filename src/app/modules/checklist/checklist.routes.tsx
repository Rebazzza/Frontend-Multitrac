import { Route, Routes } from 'react-router-dom';
import { ChecklistPage } from './ChecklistPage';
import { NuevoChecklistPage } from './NuevoChecklistPage';
import { HistorialChecklistPage } from './HistorialChecklistPage';

export function ChecklistRoutes() {
  return (
    <Routes>
      <Route index element={<ChecklistPage />} />
      <Route path='nuevo' element={<NuevoChecklistPage />} />
      <Route path='historial' element={<HistorialChecklistPage />} />
    </Routes>
  );
}
