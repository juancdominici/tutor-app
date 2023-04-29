import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export const RequestSuccess = () => {
  const { t } = useTranslation();
  const { state }: any = useLocation();

  return (
    <Row align="middle" justify="center">
      <PageTitle>{t('notifications.scheduledService', { name: state.service?.name })}</PageTitle>
      <Col span={24}>
        <div
          style={{
            margin: '50px auto auto auto',
          }}
        >
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <div
          style={{
            padding: '30px',
          }}
        >
          <p
            style={{
              fontSize: '2em',
              textAlign: 'center',
            }}
          >
            {t('notifications.scheduledService', { name: state.service?.name })}
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.scheduledServiceCaption')}
            <Link to="/appointments">{t('notifications.scheduledServiceRedirect')}</Link>
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.scheduledServiceSubCaption')}
          </p>
        </div>
      </Col>
    </Row>
  );
};
