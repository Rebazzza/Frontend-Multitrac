import { Route, Routes } from 'react-router-dom';
import { PersonalDocumentoPage } from './PersonalDocumentoPage';

export function PersonalDocumentoRoutes() {
  return (
    <Routes>
      <Route index element={<PersonalDocumentoPage />} />
    </Routes>
  );
}