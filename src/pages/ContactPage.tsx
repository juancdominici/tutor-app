import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Button, Col, Collapse, Divider, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const ContactPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageTitle>{t('common.faq')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
        <h1
          style={{
            fontWeight: 500,
            padding: '0 1rem',
            margin: '0',
            color: 'var(--primary-color)',
          }}
        >
          {t('common.faq')}
        </h1>
      </Row>
      <Collapse
        style={{
          fontSize: '0.8em',
          backgroundColor: 'var(--sider-background-color)',
        }}
        bordered={false}
        ghost
        expandIconPosition="right"
      >
        <Collapse.Panel header={t('faq.questions.faq-01')} key="faq-01">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-01')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-02')} key="faq-02">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-02')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-03')} key="faq-03">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-03')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-04')} key="faq-04">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-04')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-05')} key="faq-05">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-05')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-06')} key="faq-06">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-06')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-07')} key="faq-07">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-07')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-08')} key="faq-08">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-08')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-09')} key="faq-09">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-09')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-10')} key="faq-10">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-10')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-11')} key="faq-11">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-11')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-12')} key="faq-12">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-12')}
          </small>
        </Collapse.Panel>
        <Collapse.Panel header={t('faq.questions.faq-13')} key="faq-13">
          <small
            style={{
              fontSize: '1em',
              padding: '0 1em',
              display: 'flex',
            }}
          >
            {t('faq.answers.faq-13')}
          </small>
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Row align="middle" justify="center">
        <Col
          span={24}
          style={{
            textAlign: 'center',
            fontSize: '0.8em',
            margin: '0 1em 1em 1em',
            padding: '0 1em',
          }}
        >
          <p>{t('faq.noAnswer')}</p>
          <p>
            {t('faq.contactUs')} <a href="mailto:juancdominici@gmail.com">{t('faq.here')}</a>.
          </p>
        </Col>
      </Row>
    </>
  );
};
