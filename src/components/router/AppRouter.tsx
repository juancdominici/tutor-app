import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import { withLoading } from '@app/hocs/withLoading.hoc';
import { UserConfig } from '@app/pages/signUp/UserConfig';
import { TutorConfig } from '@app/pages/signUp/TutorConfig';
import { MercadoPagoSuccess } from '@app/pages/signUp/MercadoPagoSuccess';

const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const Error404 = withLoading(Error404Page);

const AuthLayoutFallback = withLoading(AuthLayout);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<LoginPage />} />
          <Route path="password-recover" element={<LoginPage />} />
        </Route>
        <Route path="/" element={<AuthLayoutFallback />}>
          <Route path="/user-config" element={<UserConfig />} />
          <Route path="/tutor-config" element={<TutorConfig />} />
          <Route path="/mp-success" element={<MercadoPagoSuccess />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
