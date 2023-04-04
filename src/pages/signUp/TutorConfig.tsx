import { ThemePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';
import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useTranslation } from 'react-i18next';
import { Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getMercadoPagoAuthorization } from '@app/api/mp.api';

export const TutorConfig = () => {
  const { t } = useTranslation();

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
          >
            {t('login.connectMercadoPago')}
          </Auth.SocialButton>
        </Row>
      </Auth.FormWrapper>
    </>
  );
};
