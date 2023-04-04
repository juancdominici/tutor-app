import { saveMercadoPagoRefreshToken } from '@app/api/auth.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useMutation } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const MercadoPagoSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // get the query params (code) from the url
  // send the code to the backend to save it in the database
  // redirect to the home page after the code is saved
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  const { mutate } = useMutation(saveMercadoPagoRefreshToken, {
    onSuccess: () => {
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 3000);
    },
  });

  useEffect(() => {
    if (code) {
      setTimeout(() => {
        mutate(code);
      }, 3000);
    } else {
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 3000);
    }
  }, []);

  return (
    <Row align="middle" justify="center">
      <PageTitle>{t('notifications.mpAuthSuccess')}</PageTitle>
      <Col span={24}>
        <div
          style={{
            margin: '50px auto',
          }}
        >
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <p
          style={{
            fontSize: '2em',
            textAlign: 'center',
          }}
        >
          {t('notifications.mpAuthSuccess')}
        </p>
        <p
          style={{
            fontSize: '1.2em',
            textAlign: 'center',
          }}
        >
          {t('notifications.mpAuthSuccessCaption')}
        </p>
        <p
          style={{
            fontSize: '1.2em',
            textAlign: 'center',
          }}
        >
          {t('notifications.mpAuthSuccessSubCaption')}
        </p>
      </Col>
    </Row>
  );
};
