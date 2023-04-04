import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EULA = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.eula')}</PageTitle>
      <div>
        <Row>
          <Col span={24}>End User License Agreement</Col>
          <Col span={24}></Col>
        </Row>
      </div>
    </>
  );
};
