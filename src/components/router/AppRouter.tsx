import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import { withLoading } from '@app/hocs/withLoading.hoc';
import { UserConfig } from '@app/pages/signUp/UserConfig';
import { TutorConfig } from '@app/pages/signUp/TutorConfig';
import { MercadoPagoSuccess } from '@app/pages/signUp/MercadoPagoSuccess';
import { HomePage } from '@app/pages/HomePage';
import MainMapLayout from '../layouts/main/MainLayout/MainMapLayout';
import { AddressForm } from '@app/pages/addresses/AddressForm';
import { AddressList } from '@app/pages/addresses/AddressList';
import { EULA } from '@app/pages/signUp/EULA';
import { ServiceForm } from '@app/pages/services/ServiceForm';
import { ServiceList } from '@app/pages/services/ServiceList';
import { RequestList } from '@app/pages/appointments/RequestList';
import { AppointmentList } from '@app/pages/appointments/AppointmentList';
import RequireTutorRole from './RequireTutorRole';
import RequireFreshAccount from './RequireFreshAccount';
import { ProfilePage } from '@app/pages/profile/ProfilePage';
import { RequestForm } from '@app/pages/appointments/RequestForm';
import { RequestSuccess } from '@app/pages/appointments/RequestSuccess';
import { AppointmentPaymentSuccess } from '@app/pages/appointments/AppointmentPaymentSuccess';
import { AboutUsPage } from '@app/pages/AboutUsPage';
import { ContactPage } from '@app/pages/ContactPage';
import { SettingsPage } from '@app/pages/SettingsPage';

const RequireAuthPage = React.lazy(() => import('@app/components/router/RequireAuth'));
const RequireAuth = withLoading(RequireAuthPage);
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const Error404 = withLoading(Error404Page);

const AuthLayoutFallback = withLoading(AuthLayout);

export const AppRouter: React.FC = () => {
  const protectedAuth = (
    <RequireAuth>
      <MainMapLayout />
    </RequireAuth>
  );
  const protectedFreshAccount = (
    <RequireFreshAccount>
      <AuthLayoutFallback />
    </RequireFreshAccount>
  );
  const protectedTutorAuth = (
    <RequireTutorRole>
      <MainMapLayout />
    </RequireTutorRole>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Region: auth */}
        {/* DOESN'T REQUIRE AUTHENTICATION */}
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<LoginPage />} />
          <Route path="password-recover" element={<LoginPage />} />
          <Route path="logout" element={<LoginPage />} />
        </Route>
        {/* Region: config */}
        {/* REQUIRES FRESH ACCOUNT AUTHENTICATION */}
        <Route path="/welcome" element={protectedFreshAccount}>
          <Route path="user-config" element={<UserConfig />} />
          <Route path="tutor-config" element={<TutorConfig />} />
          <Route path="mp-success" element={<MercadoPagoSuccess />} />
        </Route>
        {/* Region: root */}
        {/* REQUIRES BASIC AUTHENTICATION */}
        <Route element={protectedAuth}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/aboutUs" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/addresses/new" element={<AddressForm />} />
          <Route path="/addresses/edit/:id" element={<AddressForm />} />
          <Route path="/addresses" element={<AddressList />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/request/:serviceId" element={<RequestForm />} />
          <Route path="/request/success" element={<RequestSuccess />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/:id/success/:successUuid" element={<AppointmentPaymentSuccess />} />
        </Route>
        {/* Region: tutor */}
        {/* REQUIRES ROLE AUTHENTICATION */}
        <Route path="/tutor" element={protectedTutorAuth}>
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/edit/:id" element={<ServiceForm />} />
          <Route path="services" element={<ServiceList />} />
          <Route path="requests" element={<RequestList />} />
        </Route>
        {/* Region: etc */}
        <Route path="/i" element={<AuthLayoutFallback />}>
          <Route path="/i/eula" element={<EULA />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
