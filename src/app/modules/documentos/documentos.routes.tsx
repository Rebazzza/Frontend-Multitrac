import { Route, Routes } from 'react-router-dom';
import { DocumentosListaPage } from './DocumentosListaPage';
import { DocumentosPendientesPage } from './DocumentosPendientesPage';

export function DocumentosRoutes() {
  return (
    <Routes>
      <Route index element={<DocumentosListaPage />} />
      <Route path="pendientes" element={<DocumentosPendientesPage />} />
    </Routes>
  );
}
