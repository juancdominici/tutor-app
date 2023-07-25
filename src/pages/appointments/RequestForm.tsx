import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Map from '@app/components/common/Map';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getUserAddressesWithCoordinates as getUserAddressesAction,
  getTutorAddressesWithCoordinates as getTutorAddressesAction,
} from '@app/api/addresses.api';
import { postRequest as postRequestAction } from '@app/api/appointments.api';
import { Loading } from '@app/components/common/Loading';
import { APPOINTMENT_STATUS, LOCATION_TYPE } from '@app/constants/constants';
import { Panel } from '@app/components/common/Collapse/Collapse';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

export const RequestForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [mapCenter, setMapCenter] = useState<any>();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const addressSelected = Form.useWatch('address', form);
  const [detailForm] = Form.useForm();
  const [requestDetails, setRequestDetails] = useState<any>([]);
  const [newDetailModalVisible, setNewDetailModalVisible] = useState(false);
  const { Paragraph } = Typography;

  const { mutate: postRequest, isLoading: postRequestLoading } = useMutation(postRequestAction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      queryClient.invalidateQueries(['requests']);
      navigate('/request/success', {
        state: {
          service: state?.service,
        },
        replace: true,
      });
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const { data: userAddresses, isFetching: isFetchingUserAddresses } = useQuery(
    ['requestUserAddresses'],
    getUserAddressesAction,
    {
      enabled: state?.service?.location === LOCATION_TYPE[0],
      refetchOnWindowFocus: false,
    },
  );

  const { data: tutorAddresses, isFetching: isFetchingTutorAdresses } = useQuery(
    ['requestTutorAddresses', state?.tutorId],
    () => getTutorAddressesAction(state?.tutorId),
    {
      enabled: state?.service?.location === LOCATION_TYPE[1],
      refetchOnWindowFocus: false,
    },
  );

  const goBack = () => {
    navigate(-1);
  };

  const isValidForm = async () => {
    const isValidForm = await form.validateFields();
    return isValidForm;
  };

  const handleSubmit = async (values: any) => {
    const isValidForm = await form.validateFields();
    if (isValidForm) {
      const parsedTime = moment(values.time, 'HH:mm:ss').format('HH:mm:ss');
      const request = {
        date: values.date,
        time: parsedTime,
        address_id: values.address.value === 'online' ? null : values.address.value,
        details: requestDetails,
        tutor_service_id: state?.service?.id,
        status: APPOINTMENT_STATUS.PENDING_APPROVAL,
      };

      postRequest(request);
    }
  };

  const deleteAddress = (i: any) => {
    const newDetails = [...requestDetails];
    newDetails.splice(i, 1);
    setRequestDetails(newDetails);
  };

  const computedAddresses = () => {
    if (state?.service?.location === LOCATION_TYPE[2])
      return [
        {
          label: t(`constants.location.${LOCATION_TYPE[2]}`),
          value: LOCATION_TYPE[2],
        },
      ];
    if (state?.service?.location === LOCATION_TYPE[0])
      return userAddresses?.map((address: any) => ({
        label: address.name,
        value: address.id,
      }));
    if (state?.service?.location === LOCATION_TYPE[1])
      return tutorAddresses?.map((address: any) => ({
        label: address.name,
        value: address.id,
      }));
  };

  const handleAddDetail = async (detail: any) => {
    const isValidForm = await detailForm.validateFields();
    if (isValidForm) {
      setRequestDetails([...requestDetails, detail]);
      detailForm.resetFields();
      setNewDetailModalVisible(false);
    }
  };

  const calcSubtotalPrice = () => {
    let subtotal = 0;
    if (state.service.is_unit_price) {
      requestDetails.forEach((detail: any) => {
        subtotal += detail.quantity * state.service?.price;
      });
    } else {
      subtotal = state.service?.price;
    }
    return subtotal;
  };

  const calcServiceChargePrice = () => {
    return calcSubtotalPrice() * parseFloat(process.env.REACT_APP_MP_SERVICE_CHARGE || '0');
  };

  const calcTotalPrice = () => {
    return calcSubtotalPrice() + calcServiceChargePrice();
  };

  useEffect(() => {
    if (!state?.service) navigate('/home');
    if (state?.address) {
      setMapCenter({
        lat: state.address?.latitude,
        lng: state.address?.longitude,
      });
      const address = computedAddresses()?.find((a: any) => a.value === state.address?.address_id);
      form.setFieldValue('address', address);
    }
  }, [state, userAddresses, tutorAddresses]);

  useEffect(() => {
    if (addressSelected) {
      if (state.service.location === LOCATION_TYPE[0]) {
        const userAddress = userAddresses?.find((a: any) => a.id === addressSelected?.value);
        setMapCenter({
          lat: userAddress?.latitude,
          lng: userAddress?.longitude,
        });
      }
      if (state.service.location === LOCATION_TYPE[1]) {
        const tutorAddress = tutorAddresses?.find((a: any) => a.id === addressSelected?.value);
        setMapCenter({
          lat: tutorAddress?.latitude,
          lng: tutorAddress?.longitude,
        });
      }
    }
  }, [addressSelected]);

  if (postRequestLoading || isFetchingUserAddresses || isFetchingTutorAdresses) return <Loading />;

  return (
    <>
      <PageTitle>{t('common.addingRequest', { name: state.service?.name })}</PageTitle>
      <Row align="middle" justify="space-between">
        <Col span={3}>
          <Button type="text" size="large" onClick={goBack}>
            <ArrowLeftOutlined />
          </Button>
        </Col>
        <Col span={21}>
          <h1
            style={{
              fontWeight: 500,
              padding: '0 1rem',
              margin: '1rem 0',
              color: 'var(--primary-color)',
              textAlign: 'end',
            }}
          >
            {t('common.addingRequest', { name: state.service?.name })}
          </h1>
        </Col>
      </Row>
      <BaseForm layout="vertical" onFinish={handleSubmit} form={form}>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="date"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <DatePicker
              placeholder={t('prompts.requestDate')}
              format="DD/MM/YYYY"
              style={{
                width: '100%',
              }}
              inputReadOnly
              disabledDate={(current) => {
                return current && current < moment().subtract(1, 'day');
              }}
            />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="time"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <TimePicker
              placeholder={t('prompts.requestTime')}
              format="HH:mm"
              minuteStep={15}
              style={{
                width: '100%',
              }}
              inputReadOnly
            />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="address"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={t('prompts.requestAddress')}
              options={computedAddresses()}
              labelInValue
            />
          </FormItem>
        </Row>
        {state.service.location !== LOCATION_TYPE[2] && addressSelected && (
          <Row align="middle" style={{ height: '30vh', width: '100%' }}>
            <Map center={mapCenter} zoom={15} draggable={false} />
          </Row>
        )}
        {state.service.is_unit_price && (
          <Row align="middle">
            <Col
              style={{
                margin: '0.5em 1em',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid var(--primary-color)',
                borderRadius: '0.5em',
              }}
            >
              <h4
                style={{
                  fontWeight: 500,
                  padding: '0 1rem',
                  margin: '1em 0',
                  color: 'var(--primary-color)',
                  textAlign: 'end',
                }}
              >
                {t('common.requestDetails')}
              </h4>
              <Collapse
                defaultActiveKey={['1']}
                expandIconPosition="start"
                style={{
                  margin: '0.5em',
                  border: 'none',
                  boxShadow: '0px 10px 10px 0px #00000022',
                  width: '90%',
                  backgroundColor: 'var(--sider-background-color)',
                }}
              >
                {requestDetails?.map((detail: any, i: any) => (
                  <Panel
                    style={{
                      border: 'none',
                    }}
                    header={
                      <span style={{ fontSize: '0.8em' }}>
                        <strong>{t('common.name')}: </strong>
                        {detail.detail}
                      </span>
                    }
                    key={i}
                    extra={
                      <Button
                        type="text"
                        shape="circle"
                        size="small"
                        style={{ alignItems: 'end' }}
                        onClick={() => deleteAddress(i)}
                        danger
                        icon={<DeleteOutlined />}
                      />
                    }
                  >
                    <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                      <strong>{t('common.quantity')}: </strong>
                      {detail.quantity}
                    </p>
                    {detail.additional_details && (
                      <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                        <strong style={{ marginRight: '1em' }}>{t('common.additionalDetails')}: </strong>
                        <Paragraph
                          ellipsis={{
                            rows: 4,
                            expandable: true,
                            symbol: t('common.readMore'),
                          }}
                        >
                          {detail.additional_details}
                        </Paragraph>
                      </p>
                    )}
                  </Panel>
                ))}
              </Collapse>
              <Button
                type="dashed"
                style={{
                  margin: '1em',
                  width: '90%',
                  borderWidth: '3px',
                  color: 'var(--primary-color)',
                  borderColor: 'var(--primary-color)',
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setNewDetailModalVisible(true);
                }}
              >
                <PlusOutlined />
              </Button>
              <Modal
                title={t('common.addingRequestDetail')}
                visible={newDetailModalVisible}
                onCancel={() => setNewDetailModalVisible(false)}
                footer={null}
              >
                <BaseForm layout="vertical" onFinish={handleAddDetail} form={detailForm}>
                  <Row align="middle">
                    <FormItem
                      style={{ margin: '0.5em 1em', width: '100%' }}
                      name="detail"
                      rules={[{ required: true, message: t('common.requiredField') }]}
                    >
                      <Input placeholder={t('prompts.requestDetail')} />
                    </FormItem>
                  </Row>
                  <Row align="middle">
                    <FormItem style={{ margin: '0.5em 1em', width: '100%' }} name="additional_details">
                      <TextArea placeholder={t('prompts.requestAdditionalDetails')} style={{ height: '10em' }} />
                    </FormItem>
                  </Row>
                  <Row align="middle">
                    <FormItem
                      style={{ margin: '0.5em 1em', width: '100%' }}
                      name="quantity"
                      rules={[{ required: true, message: t('common.requiredField') }]}
                    >
                      <InputNumber
                        type="number"
                        addonAfter="u."
                        controls
                        placeholder={t('prompts.requestQuantity')}
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </Row>

                  <Row align="middle" justify="center">
                    <Button type="primary" htmlType="submit" style={{ margin: '1em', width: '100%' }}>
                      {t('common.save')}
                    </Button>
                  </Row>
                </BaseForm>
              </Modal>
            </Col>
          </Row>
        )}
        <Row
          align="middle"
          justify="space-between"
          style={{
            margin: '0.5em 1em',
            padding: '1em',
            border: '1px solid var(--primary-color)',
            borderRadius: '0.5em',
          }}
        >
          <Col style={{ padding: '0.5em 1em' }}>{t('common.subtotalPrice')}</Col>
          <Col style={{ padding: '0.5em 1em' }}>{calcSubtotalPrice()} ARS</Col>
          {}
          <Col style={{ padding: '0.5em 1em' }}>{t('common.serviceChargePrice')}</Col>
          <Col style={{ padding: '0.5em 1em' }}>{calcServiceChargePrice()} ARS</Col>

          <Col span={24} style={{ padding: '0.5em' }}>
            <hr />
          </Col>
          <Col style={{ padding: '0.5em 1em', fontWeight: 'bold' }}>{t('common.totalPrice')}</Col>
          <Col style={{ padding: '0.5em 1em', fontWeight: 'bold' }}>{calcTotalPrice()} ARS</Col>
        </Row>
        <Row align="middle" justify="center">
          <Button
            type="primary"
            htmlType="submit"
            style={{ margin: '1em', width: '100%' }}
            disabled={(state.service.is_unit_price && requestDetails.length === 0) || !isValidForm()}
          >
            {t('common.requestButton')}
          </Button>
        </Row>
      </BaseForm>
    </>
  );
};
