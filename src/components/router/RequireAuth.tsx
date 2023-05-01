import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { Loading } from '../common/Loading';
import {
  checkUserExistance as checkUserExistanceAction,
  changeUserPassword as changeUserPasswordAction,
  checkMPTokenValidity as checkMPTokenValidityAction,
} from '@app/api/auth.api';
import supabase from '@app/api/supabase';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import FormItem from 'antd/es/form/FormItem';
import { FormInputPassword } from '../layouts/AuthLayout/AuthLayout.styles';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const { t } = useTranslation();
  const [passwordRecoveryModal, togglePasswordRecoveryModal] = useState(false);
  const [form] = BaseForm.useForm();
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        togglePasswordRecoveryModal(true);
      }
    });
  }, []);

  const { mutate: changePassword } = useMutation(['changePassword'], changeUserPasswordAction, {
    onSuccess: (data: any) => {
      notificationController.success({
        message: t('common.passwordChanged'),
      });
      togglePasswordRecoveryModal(false);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const { data: checkUserExistance, isLoading } = useQuery(['checkUserExistance'], checkUserExistanceAction, {
    refetchOnWindowFocus: false,
  });
  const { data: checkMPToken, isLoading: isLoadingCheckMPToken } = useQuery(
    ['checkMPTokenValidity'],
    checkMPTokenValidityAction,
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleSubmit = (values: any) => {
    changePassword(values.newPassword);
  };

  return isLoading || isLoadingCheckMPToken || passwordRecoveryModal ? (
    <>
      <Loading />
      <Modal
        title={t('common.passwordRecovery')}
        visible={passwordRecoveryModal}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
        onCancel={() => togglePasswordRecoveryModal(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleSubmit(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <BaseForm form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <FormItem
            name="newPassword"
            required
            rules={[
              { required: true, message: t('common.requiredField') },
              { min: 6, message: t('login.passwordLength') },
              { max: 20, message: t('login.passwordLength') },
              {
                validator: (rule, value) =>
                  // password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,20}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(t('login.passwordRequirements')),
              },
            ]}
          >
            <FormInputPassword placeholder={t('login.password')} />
          </FormItem>
        </BaseForm>
      </Modal>
    </>
  ) : checkUserExistance === 'tutor' && !checkMPToken ? (
    <Navigate to="/welcome/tutor-config" replace />
  ) : checkUserExistance === 'user' || checkUserExistance === 'tutor' ? (
    <>{children}</>
  ) : checkUserExistance === 'fresh' ? (
    <Navigate to="/welcome/user-config" replace />
  ) : checkUserExistance === 'none' ? (
    <Navigate to="/auth/login" replace />
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default RequireAuth;
