import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser as getUserAction, postUser as postUserAction, putUser as putUserAction } from '@app/api/users.api';
import { Loading } from '@app/components/common/Loading';
import { FormInputPassword } from '@app/components/layouts/AuthLayout/AuthLayout.styles';

export const UserForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: userData, isFetching: userLoading } = useQuery(['user', id], async () => getUserAction(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id && !userLoading && userData?.user) {
      form.setFieldsValue({
        email: userData?.user.email || '',
      });
    }
  }, [userData, userLoading, form, id]);

  const { mutate: postUser, isLoading: postUserLoading } = useMutation(postUserAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.userAdded') });
      queryClient.invalidateQueries(['users']);
      navigate(-1);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });
  const { mutate: putUser, isLoading: putUserLoading } = useMutation(putUserAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.userUpdated') });
      queryClient.invalidateQueries(['users']);
      navigate(-1);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: any) => {
    const isValidForm = await form.validateFields();
    if (isValidForm) {
      const user = {
        email: values.email,
        password: values.password,
        status: true,
      };

      if (id) {
        putUser({ id, ...user });
      } else {
        postUser({
          email_confirm: values.email_confirm,
          ...user,
        });
      }
    }
  };

  if (userLoading || postUserLoading || putUserLoading) return <Loading />;

  return (
    <>
      <PageTitle>{id ? t('common.editingUser') : t('common.addingUser')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" size="large" onClick={goBack}>
          <ArrowLeftOutlined />
        </Button>
        <h1
          style={{
            fontWeight: 500,
            padding: '0 1rem',
            margin: '0',
            color: 'var(--primary-color)',
          }}
        >
          {id ? t('common.editingUser') : t('common.addingUser')}
        </h1>
      </Row>
      <BaseForm layout="vertical" onFinish={handleSubmit} form={form}>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="email"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('login.email')} />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            name="password"
            style={{ margin: '0.5em 1em', width: '100%' }}
            rules={[
              { min: 6, message: t('login.passwordLength') },
              { max: 20, message: t('login.passwordLength') },
              {
                validator: (rule, value) =>
                  // password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,20}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(t('login.passwordRequirements')),
              },
              { required: true, message: t('common.requiredField') },
            ]}
          >
            <FormInputPassword placeholder={t('login.password')} />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem style={{ margin: '0.5em 1em', width: '100%' }} name="email_confirm">
            <Checkbox disabled={!!id}>{t('common.emailConfirm')}</Checkbox>
          </FormItem>
        </Row>
        <Row align="middle" justify="center">
          <Button type="primary" htmlType="submit" style={{ margin: '1em', width: '100%' }}>
            {t('common.save')}
          </Button>
        </Row>
      </BaseForm>
    </>
  );
};
