import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { ChangePasswordPage } from './change-password.page';

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="change-password" element={<ChangePasswordPage />} />
    </Routes>
  );
}
