import { Modal } from 'antd';
import React from 'react';
import { BaseForm } from './forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { changeUserPassword as changeUserPasswordAction } from '@app/api/auth.api';

import { notificationController } from '@app/controllers/notificationController';
import { useMutation } from '@tanstack/react-query';
import FormItem from 'antd/es/form/FormItem';
import { FormInputPassword } from '../layouts/AuthLayout/AuthLayout.styles';
export const ChangePasswordModal = ({ passwordRecoveryModal, togglePasswordRecoveryModal }: any) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();

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
  const handleSubmit = (values: any) => {
    changePassword({
      password: values.newPassword,
    });
  };
  return (
    <Modal
      title={t('common.passwordRecovery')}
      visible={passwordRecoveryModal}
      okText={t('common.submit')}
      cancelText={t('common.cancel')}
      onCancel={() => togglePasswordRecoveryModal(false)}
      onOk={form.submit}
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
  );
};
