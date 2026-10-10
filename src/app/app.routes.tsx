import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './modules/auth/login.page';
import { RegisterPage } from './modules/auth/register.page';
import { ChangePasswordPage } from './modules/auth/change-password.page';
import { CatalogRoutes } from './modules/catalogs/catalog.routes';
import { SuenoRoutes } from './modules/sueno/sueno.routes';
import { OperacionesRoutes } from './modules/operaciones/operaciones.routes';
import { ChecklistRoutes } from './modules/checklist/checklist.routes';
import { PersonalDocumentoRoutes } from './modules/documentos/personal-documento.routes';
import { DocumentosRoutes } from './modules/documentos/documentos.routes';
import { PersonalRoutes } from './modules/personal/personal.routes';
import { DashboardPage } from './modules/dashboard/dashboard.page';
import { EquiposRoutes } from './modules/equipos/equipos.routes';
import { MainLayout } from './shared/layouts/main-layout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/sueno/*" element={<SuenoRoutes />} />
          <Route path="/operaciones/*" element={<OperacionesRoutes />} />
          <Route path="/equipos/*" element={<EquiposRoutes />} />
          <Route path="/checklist/*" element={<ChecklistRoutes />} />
          <Route path="/personal/*" element={<PersonalRoutes />} />
          <Route path="/personal-documentos/*" element={<PersonalDocumentoRoutes />} />
          <Route path="/documentos/*" element={<DocumentosRoutes />} />
          <Route path="/catalogos/*" element={<CatalogRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
}
