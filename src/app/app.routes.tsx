import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './modules/auth/login.page';
import { RegisterPage } from './modules/auth/register.page';
import { ChangePasswordPage } from './modules/auth/change-password.page';
import { CatalogRoutes } from './modules/catalogs/catalog.routes';
import { SuenoRoutes } from './modules/sueno/sueno.routes';
import { PersonalDocumentoRoutes } from './modules/documentos/personal-documento.routes';
import { PersonalRoutes } from './modules/personal/personal.routes';
import { DashboardPage } from './modules/dashboard/dashboard.page';
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
          <Route path="/personal/*" element={<PersonalRoutes />} />
          <Route path="/personal-documentos/*" element={<PersonalDocumentoRoutes />} />
          <Route path="/catalogos/*" element={<CatalogRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
}
