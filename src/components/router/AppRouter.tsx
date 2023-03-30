import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import { withLoading } from '@app/hocs/withLoading.hoc';
import { UserConfig } from '@app/pages/signUp/UserConfig';
import { TutorConfig } from '@app/pages/signUp/TutorConfig';
import { MercadoPagoSuccess } from '@app/pages/signUp/MercadoPagoSuccess';
import { HomePage } from '@app/pages/HomePage';
import MainLayout from '../layouts/main/MainLayout/MainLayout'; /* 
import RequireUserRole from './RequireUserRole';
import RequireTutorRole from './RequireTutorRole'; */

const RequireAuthPage = React.lazy(() => import('@app/components/router/RequireAuth'));
const RequireAuth = withLoading(RequireAuthPage);
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const Error404 = withLoading(Error404Page);

const AuthLayoutFallback = withLoading(AuthLayout);

export const AppRouter: React.FC = () => {
  /* const protectedUserRole = (
    <RequireUserRole>
      <MainLayout />
    </RequireUserRole>
  );

  const protectedTutorRole = (
    <RequireTutorRole>
      <MainLayout />
    </RequireTutorRole>
  ); */

  const protectedAuth = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Region: auth */}
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<LoginPage />} />
          <Route path="password-recover" element={<LoginPage />} />
          <Route path="logout" element={<LoginPage />} />
        </Route>
        {/* Region: config */}
        <Route path="/welcome" element={<AuthLayoutFallback />}>
          <Route path="user-config" element={<UserConfig />} />
          <Route path="tutor-config" element={<TutorConfig />} />
        </Route>
        {/* Region: root */}
        <Route path="/" element={protectedAuth}>
          <Route path="mp-success" element={<MercadoPagoSuccess />} />
          <Route path="home" element={<HomePage />} />
        </Route>
        {/* Region: etc */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
