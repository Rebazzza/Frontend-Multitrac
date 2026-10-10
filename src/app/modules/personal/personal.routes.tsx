import { Routes, Route } from 'react-router-dom';
import { PersonalPage } from './PersonalPage';
import { PersonalFichaPage } from './PersonalFichaPage';
import { PersonalVencimientosPage } from './vencimientos/PersonalVencimientosPage';

export function PersonalRoutes() {
  return (
    <Routes>
      <Route index element={<PersonalPage />} />
      <Route path='nuevo' element={<PersonalFichaPage />} />
      <Route path=':id' element={<PersonalFichaPage />} />
      <Route path='vencimientos' element={<PersonalVencimientosPage />} />
    </Routes>
  );
}

