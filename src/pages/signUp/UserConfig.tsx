import React, { useState } from 'react';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { ThemePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, DatePicker, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { newTutor, newUser } from '@app/api/auth.api';
import { useMutation } from '@tanstack/react-query';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Dates } from '@app/constants/Dates';
import { mergeBy } from '@app/utils/utils';

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

const Step1 = () => {
  return <></>;
};

export const UserConfig = () => {
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [fields, setFields] = useState<FieldData[]>([
    { name: 'name', value: '' },
    { name: 'bio', value: '' },
    { name: 'birthday', value: Dates.getDate(1576789200000) },
  ]);

  const theme = useAppSelector((state: any) => state.theme.theme);
  const { TextArea } = Input;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const { mutate: createNewTutor, isLoading: isLoadingTutor } = useMutation(newTutor, {
    onSuccess: () => {
      navigate('/welcome/tutor-config');
    },
  });

  const { mutate: createNewUser, isLoading: isLoadingUser } = useMutation(newUser, {
    onSuccess: () => {
      navigate('/home');
    },
  });

  if (isLoadingTutor || isLoadingUser) {
    return <Loading />;
  }

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: t('common.basicInfo'),
    },
    {
      title: t('common.confirmation'),
    },
  ];

  const handleNewTutor = () => {
    createNewTutor({
      name: fields[0].value,
      bio: fields[1].value,
      birthdate: fields[2].value,
      joindate: new Date().toISOString(),
    });
  };

  const handleNewUser = () => {
    createNewUser({
      name: fields[0].value,
      bio: fields[1].value,
      birthdate: fields[2].value,
      joindate: new Date().toISOString(),
    });
  };

  const formFieldsUi = [
    <Row align="middle" justify="center" key="1">
      <BaseForm.Item
        name="name"
        label={t('prompts.name')}
        rules={[{ required: true, message: t('common.requiredField') }]}
        style={{
          width: '100%',
        }}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="bio"
        label={t('prompts.bio')}
        rules={[{ required: true, message: t('common.requiredField') }]}
        style={{
          width: '100%',
        }}
      >
        <TextArea size="large" style={{ fontSize: '1em', padding: '0.5em 1em', height: '10em' }} />
      </BaseForm.Item>
      <BaseForm.Item
        name="birthday"
        label={t('prompts.birthday')}
        rules={[{ required: true, message: t('common.requiredField') }]}
        style={{
          width: '100%',
        }}
      >
        <DatePicker
          format="DD/MM/YYYY"
          style={{
            width: '100%',
          }}
        />
      </BaseForm.Item>
    </Row>,
    <Row align="middle" justify="center" key="2">
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
          <Link to="/i/eula" target="_blank">
            terminos y condiciones
          </Link>
        </span>
      </Row>
    </Row>,
  ];

  return (
    <>
      <PageTitle>{t('login.finishUserSetup')}</PageTitle>
      <Auth.FormWrapper>
        <p
          style={{
            fontSize: '1.5em',
            textAlign: 'center',
          }}
        >
          {t('common.finishUserSetup')}
        </p>
        <BaseForm
          name="stepForm"
          form={form}
          fields={fields}
          requiredMark={false}
          onFieldsChange={(_, allFields) => {
            const currentFields = allFields.map((item) => ({
              name: Array.isArray(item.name) ? item.name[0] : '',
              value: item.value,
            }));
            const uniqueData = mergeBy(fields, currentFields, 'name');
            setFields(uniqueData);
          }}
        >
          <div>{formFieldsUi[current]}</div>
          <Row justify="end">
            {current > 0 && (
              <Button type="default" onClick={() => prev()}>
                {t('common.goBack')}
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {t('common.next')}
              </Button>
            )}
          </Row>
        </BaseForm>
      </Auth.FormWrapper>
    </>
  );
};
