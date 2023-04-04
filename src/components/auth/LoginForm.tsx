import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './LoginForm.styles';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';
import {
  logout as logoutAction,
  login as loginAction,
  loginWithGoogle as loginWithGoogleAction,
  register as registerAction,
  passwordRecover as passwordRecoverAction,
} from '@app/api/auth.api';
import { useMutation } from '@tanstack/react-query';
import { Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { ThemePicker } from '../header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useAppSelector((state: any) => state.theme.theme);
  const img = theme === 'dark' ? logoDark : logo;

  useEffect(() => {
    if (isLogout()) {
      logout();
    }
  }, []);

  const isLogout = () => {
    return window.location.pathname.includes('logout');
  };
  const isRegister = () => {
    return window.location.pathname.includes('register');
  };
  const isPasswordRecover = () => {
    return window.location.pathname.includes('password-recover');
  };

  const { mutate: logout } = useMutation(logoutAction, {
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });
  const { mutate: loginWithEmail, isLoading: loginLoading } = useMutation(loginAction, {
    onSuccess: (data: any) => {
      navigate('/home');
    },
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });
  const { mutate: loginWithGoogle, isLoading: loginWithGoogleLoading } = useMutation(loginWithGoogleAction, {
    onSuccess: (data: any) => {
      navigate('/home');
    },
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });
  const { mutate: register, isLoading: registerIsLoading } = useMutation(registerAction, {
    onSuccess: (data: any) => {
      notificationController.info({
        message: t('login.registerEmailSent'),
      });
      setTimeout(() => {
        navigate('/welcome/user-config');
      }, 3000);
    },
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });
  const { mutate: passwordRecover, isLoading: passwordRecoverIsLoading } = useMutation(passwordRecoverAction, {
    onSuccess: (data: any) => {
      notificationController.info({
        message: t('login.passwordRecoverEmailSent'),
      });
    },
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });

  const handleSubmit = (values: any) => {
    if (isRegister()) {
      register(values);
    } else if (isPasswordRecover()) {
      passwordRecover(values);
    } else {
      loginWithEmail(values);
    }
  };

  return (
    <Auth.FormWrapper>
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
        }}
      >
        <ThemePicker />
      </div>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <img
          src={img}
          alt="Tutor"
          width={100}
          height={100}
          style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em' }}
        />
        <BaseForm.Item noStyle>
          <Auth.SocialButton
            icon={<GoogleOutlined />}
            onClick={(e) => {
              e.preventDefault();
              loginWithGoogle();
            }}
            type="primary"
            htmlType="button"
            loading={loginWithGoogleLoading}
            hidden={isPasswordRecover()}
          >
            {t('login.loginWithGoogle')}
          </Auth.SocialButton>
        </BaseForm.Item>
        <Divider />
        <Auth.FormItem
          name="usuario"
          label={t('login.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('login.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('login.password')}
          name="password"
          rules={[
            { min: !isPasswordRecover() ? 6 : 0, message: t('login.passwordLength') },
            { max: !isPasswordRecover() ? 20 : 0, message: t('login.passwordLength') },
            {
              validator: (rule, value) =>
                isPasswordRecover() ||
                // password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,20}$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject(t('login.passwordRequirements')),
            },
            { required: !isPasswordRecover(), message: t('common.requiredField') },
          ]}
          hidden={isPasswordRecover()}
        >
          <Auth.FormInputPassword placeholder={t('login.password')} />
        </Auth.FormItem>

        <BaseForm.Item noStyle>
          <Auth.SocialButton
            type="primary"
            htmlType="submit"
            loading={registerIsLoading || passwordRecoverIsLoading || loginLoading}
          >
            {isRegister() ? t('login.register') : isPasswordRecover() ? t('login.passwordRecover') : t('login.login')}
          </Auth.SocialButton>
        </BaseForm.Item>
      </BaseForm>
      <S.RegisterActionText>
        {isRegister() || isPasswordRecover() ? (
          <Link to="/auth/login">{t('login.loginAction')}</Link>
        ) : (
          <Link to="/auth/register">{t('login.registerAction')}</Link>
        )}
      </S.RegisterActionText>
      <S.ForgotPasswordText>
        {isPasswordRecover() ? null : <Link to="/auth/password-recover">{t('login.forgotPassword')}</Link>}
      </S.ForgotPasswordText>
    </Auth.FormWrapper>
  );
};
