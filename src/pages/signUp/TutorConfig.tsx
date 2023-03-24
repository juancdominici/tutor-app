import { checkUserExistance } from '@app/api/auth.api';
import { ThemePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useTranslation } from 'react-i18next';
import { Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getMercadoPagoAuthorization } from '@app/api/mp.api';

export const TutorConfig = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const userAlreadyExists = async () => {
    // If the user already exists in the 'user_profiles' collection, redirect to the home page
    // If the user already exists in the 'tutors' collection, redirect to the tutor config page
    const userType = await checkUserExistance();
    switch (userType) {
      case 'user':
        navigate('/user-config');
        break;
      case 'tutor':
        break;
      default:
        navigate('/user-config');
        break;
    }
  };

  useEffect(() => {
    userAlreadyExists();
  }, []);

  return (
    <>
      <PageTitle>{t('login.finishTutorSetup')}</PageTitle>
      <Auth.FormWrapper>
        <div
          style={{
            position: 'absolute',
            top: '0rem',
            right: '1rem',
          }}
        >
          <ThemePicker />
        </div>
        <Row align="middle" justify="center">
          <InfoCircleOutlined
            style={{
              color: 'var(--secondary-color)',
              fontSize: '8em',
              marginBottom: '0.5em',
              animation: 'sway 3s infinite',
              transformOrigin: '50% 100% 0',
            }}
          />

          <p
            style={{
              fontSize: '1.5em',
              textAlign: 'center',
            }}
          >
            {t('login.tutorConfig')}
          </p>
          <Auth.SocialButton
            onClick={(e) => {
              e.preventDefault();
              getMercadoPagoAuthorization();
            }}
            type="primary"
            htmlType="submit"
            data-testId="login--loginBtn"
          >
            {t('login.connectMercadoPago')}
          </Auth.SocialButton>
        </Row>
      </Auth.FormWrapper>
    </>
  );
};
