import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getService as getServiceAction,
  postService as postServiceAction,
  putService as putServiceAction,
} from '@app/api/services.api';
import { Loading } from '@app/components/common/Loading';
import { LOCATION_TYPE, SERVICE_TYPE } from '@app/constants/constants';
import { useEffect } from 'react';
const { TextArea } = Input;
export const ServiceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: serviceData, isFetching: serviceLoading } = useQuery(
    ['service', id],
    async () => getServiceAction(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (id && !serviceLoading) {
      form.setFieldsValue({
        name: serviceData[0]?.name,
        description: serviceData[0]?.description,
        price: serviceData[0]?.price,
        location: serviceData[0]?.location,
        type: serviceData[0]?.type,
        is_unit_price: serviceData[0]?.is_unit_price,
        cancelation_fee: serviceData[0]?.cancelation_fee * 100,
      });
    }
  }, [serviceData, serviceLoading]);

  const { mutate: postService, isLoading: postServiceLoading } = useMutation(postServiceAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.serviceAdded') });
      queryClient.invalidateQueries(['services']);
      navigate(-1);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });
  const { mutate: putService, isLoading: putServiceLoading } = useMutation(putServiceAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.serviceUpdated') });
      queryClient.invalidateQueries(['services']);
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
      const service = {
        name: values.name,
        description: values.description,
        price: values.price,
        location: values.location,
        type: values.type,
        is_unit_price: values.is_unit_price,
        cancelation_fee: values.cancelation_fee / 100,
        status: true,
      };

      if (id) {
        putService({ id, ...service });
      } else {
        postService(service);
      }
    }
  };

  if (serviceLoading || postServiceLoading || putServiceLoading) return <Loading />;

  return (
    <>
      <PageTitle>{id ? t('common.editingService') : t('common.addingService')}</PageTitle>
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
          {id ? t('common.editingService') : t('common.addingService')}
        </h1>
      </Row>
      <BaseForm layout="vertical" onFinish={handleSubmit} form={form}>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="name"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('common.name')} />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem style={{ margin: '0.5em 1em', width: '100%' }} name="description">
            <TextArea placeholder={t('common.description')} style={{ height: '10em' }} />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="location"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              placeholder={t('common.location')}
              options={[...LOCATION_TYPE.map((type) => ({ value: type, label: t(`constants.location.${type}`) }))]}
            />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="type"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={t('common.serviceType')}
              placement="topLeft"
              options={[...SERVICE_TYPE.map((type) => ({ value: type, label: t(`constants.service_types.${type}`) }))]}
            />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="price"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <InputNumber
              placeholder={t('common.price')}
              style={{ width: '100%' }}
              type="number"
              addonAfter="ARS"
              controls
            />
          </FormItem>
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="cancelation_fee"
            extra={<p style={{ color: 'var(--subtext-color)', fontSize: '0.8em', margin: '0.5em' }}>Default: 15%</p>}
          >
            <InputNumber
              placeholder={t('common.cancelation_fee')}
              style={{ width: '100%' }}
              type="number"
              addonAfter="%"
            />
          </FormItem>
          <Col span={20}>
            <span
              style={{
                margin: '0.5em 1em',
              }}
            >
              {t('prompts.isUnitPrice')}
            </span>
          </Col>
          <Col
            span={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormItem style={{ margin: '0.5em' }} name="is_unit_price" valuePropName="checked">
              <Checkbox />
            </FormItem>
          </Col>
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
