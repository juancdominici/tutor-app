import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { Button, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const AboutUsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageTitle>{t('common.aboutUs')}</PageTitle>
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
          {t('common.aboutUs')}
        </h1>
        {/* <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }}>
            <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
          </Button> */}
      </Row>
      <Row
        align="middle"
        justify="space-between"
        style={{
          margin: 'auto',
          padding: '2em',
        }}
      >
        <p
          style={{
            fontWeight: 500,
          }}
        >
          En{' '}
          <strong
            style={{
              color: 'var(--primary-color)',
            }}
          >
            Tutor
          </strong>
          , creemos que cuidar de las plantas es más que una simple tarea cotidiana,{' '}
          <strong
            style={{
              color: 'var(--primary-color)',
            }}
          >
            es un estilo de vida
          </strong>
          .
        </p>
        <p
          style={{
            fontWeight: 500,
          }}
        >
          Nuestra plataforma surge de la pasión de nuestra familia por las plantas y la necesidad de encontrar una
          solución fácil y segura para aquellas personas que buscan ayuda profesional para cuidar de sus plantas en su
          hogar, oficina o negocio.
        </p>
        <p
          style={{
            fontWeight: 500,
          }}
        >
          Conectamos a personas que necesitan encontrar profesionales del cuidado de plantas responsables con aquellos
          que ofrecen sus servicios. Ya sea que necesite a alguien para regar las plantas mientras está fuera de la
          ciudad o para ayudar con la poda y el trasplante de las plantas de su oficina, estamos aquí para ayudar.
        </p>
        <p
          style={{
            fontWeight: 500,
          }}
        >
          En{' '}
          <strong
            style={{
              color: 'var(--primary-color)',
            }}
          >
            Tutor
          </strong>
          , queremos que volver el mundo más verde sea fácil y accesible para todos.
        </p>
      </Row>
    </>
  );
};
