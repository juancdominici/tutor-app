import React, { useState } from 'react';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { ThemePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { newTutor, newUser } from '@app/api/auth.api';
import { useMutation } from '@tanstack/react-query';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

export const UserConfig = () => {
  const theme = useAppSelector((state: any) => state.theme.theme);
  const img = theme === 'dark' ? logoDark : logo;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const { mutate: handleNewTutor, isLoading: isLoadingTutor } = useMutation(newTutor, {
    onSuccess: () => {
      navigate('/welcome/tutor-config');
    },
  });

  const { mutate: handleNewUser, isLoading: isLoadingUser } = useMutation(newUser, {
    onSuccess: () => {
      navigate('/home');
    },
  });

  if (isLoadingTutor || isLoadingUser) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('login.finishUserSetup')}</PageTitle>
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
        <img
          src={img}
          alt="Tutor"
          width={100}
          height={100}
          style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em' }}
        />
        <Row align="middle" justify="center">
          <Button
            disabled={!termsAndConditions}
            style={{
              width: 300,
              height: 150,
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              fontWeight: 'normal',
              backgroundImage: '',
            }}
            onClick={() => handleNewTutor()}
          >
            Quiero ser Tutor
          </Button>
          <Button
            disabled={!termsAndConditions}
            style={{
              width: 300,
              height: 150,
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              fontWeight: 'normal',
              backgroundImage: '',
            }}
            onClick={() => handleNewUser()}
          >
            Necesito un Tutor
          </Button>
          <Row wrap={false} style={{ marginTop: '1em' }}>
            <Checkbox
              style={{ paddingRight: 10 }}
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e?.target?.checked)}
            />
            <span>
              Acepto los{' '}
              <Link to="/terms-and-conditions" target="_blank">
                terminos y condiciones
              </Link>
            </span>
          </Row>
        </Row>
      </Auth.FormWrapper>
    </>
  );
};
