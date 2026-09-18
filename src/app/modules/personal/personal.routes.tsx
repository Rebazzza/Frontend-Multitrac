import { Route, Routes } from 'react-router-dom';
import { PersonalPage } from './PersonalPage';
import { PersonalFichaPage } from './PersonalFichaPage';

export function PersonalRoutes() {
  return (
    <Routes>
      <Route index element={<PersonalPage />} />
      <Route path="nuevo" element={<PersonalFichaPage />} />
      <Route path=":id" element={<PersonalFichaPage />} />
    </Routes>
  );
}