import React, { useState } from 'react';
import { ArrowLeftOutlined, CommentOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Button, Collapse, Modal, Row, Select, Space, Spin, Tooltip, Typography } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserAppointments as getUserAppointmentsAction,
  getTutorAppointments as getTutorAppointmentsAction,
  changeAppointmentStatus as changeAppointmentStatusAction,
} from '../../api/appointments.api';
import { createPreference as createPreferenceAction } from '../../api/mp.api';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { LOCATION_TYPE, APPOINTMENT_STATUS } from '@app/constants/constants';
import { checkUserExistance } from '@app/api/auth.api';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ShareButton } from '@app/components/common/ShareButton';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import logo from '@app/assets/logo-dark.png';

const { Panel } = Collapse;
const { Paragraph } = Typography;

export const AppointmentList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [appointments, setAppointments] = useState<any>([]);
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();

  const { data: userType, isFetching: isLoadingUserType } = useQuery(['userType'], checkUserExistance, {
    refetchOnWindowFocus: false,
  });

  const { isFetching: isLoadingUserAppointments } = useQuery(['user_appointments'], getUserAppointmentsAction, {
    enabled: userType === 'user',
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAppointments(data);
    },
  });

  const { isFetching: isLoadingTutorAppointments } = useQuery(['tutor_appointments'], getTutorAppointmentsAction, {
    enabled: userType === 'tutor',
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAppointments(data);
    },
  });

  const { mutate: changeAppointmentStatus, isLoading: isLoadingChangeAppointmentStatus } = useMutation(
    changeAppointmentStatusAction,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user_appointments']);
        queryClient.invalidateQueries(['tutor_appointments']);
      },
    },
  );
  const { mutate: createPreference, isLoading: isLoadingCreatePreference } = useMutation(createPreferenceAction, {
    onSuccess: (data) => {
      window.location.replace(data.init_point);
    },
  });

  const filteredAppointments = () => {
    return appointments;
  };

  const handleReview = (appointment: any) => {
    navigate(`/profile/${appointment.tutor_services.tutors.id}/`);
  };

  const handleCancelWithFee = (appointment: any) => {
    const { price, is_unit_price } = appointment.tutor_services;
    const total = calcAppointmentPrice(appointment);
    const successUuid = uuidv4();
    localStorage.setItem('successUuid', successUuid);

    const preference = {
      items: is_unit_price
        ? appointment.appointment_details.map((detail: any) => {
            return {
              title: detail.detail,
              quantity: detail.quantity,
              currency_id: 'ARS',
              unit_price: appointment.tutor_services.price * 1.25,
              description: detail.additional_details,
            };
          })
        : [
            {
              title: appointment.tutor_services.name,
              quantity: 1,
              currency_id: 'ARS',
              unit_price: price * 1.25,
            },
          ],
      marketplace_fee: parseFloat(process.env.REACT_APP_MP_SERVICE_CHARGE || '0') * total,
      back_urls: {
        success: `https://tutor-app-ps.netlify.app/appointments/${appointment.id}/cancel-successful/${successUuid}`,
        failure: `https://tutor-app-ps.netlify.app/appointments`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [
          {
            id: 'amex',
          },
        ],
        excluded_payment_types: [
          {
            id: 'atm',
          },
        ],
      },
      payer: {
        name: appointment.user_profiles.name,
      },
    };

    createPreference({ tutor_id: appointment.tutor_services.tutors.id, preference });
  };

  const handlePayment = (appointment: any) => {
    const { price, is_unit_price } = appointment.tutor_services;
    const total = calcAppointmentPrice(appointment);
    const successUuid = uuidv4();
    localStorage.setItem('successUuid', successUuid);

    const preference = {
      items: is_unit_price
        ? appointment.appointment_details.map((detail: any) => {
            return {
              title: detail.detail,
              quantity: detail.quantity,
              currency_id: 'ARS',
              unit_price: appointment.tutor_services.price,
              description: detail.additional_details,
            };
          })
        : [
            {
              title: appointment.tutor_services.name,
              quantity: 1,
              currency_id: 'ARS',
              unit_price: price,
            },
          ],
      marketplace_fee: parseFloat(process.env.REACT_APP_MP_SERVICE_CHARGE || '0') * total,
      back_urls: {
        success: `https://tutor-app-ps.netlify.app/appointments/${appointment.id}/success/${successUuid}`,
        failure: `https://tutor-app-ps.netlify.app/appointments`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [
          {
            id: 'amex',
          },
        ],
        excluded_payment_types: [
          {
            id: 'atm',
          },
        ],
      },
      payer: {
        name: appointment.user_profiles.name,
      },
    };

    createPreference({ tutor_id: appointment.tutor_services.tutors.id, preference });
  };

  const createTableData = (appointment: any) => {
    const { price, is_unit_price } = appointment.tutor_services;
    const tableData: any = [];
    if (is_unit_price) {
      appointment.appointment_details.map((detail: any, i: any) => {
        tableData.push([
          i + 1,
          detail.detail || '',
          detail.additional_details || '',
          `$ ${price.toLocaleString()}`,
          detail.quantity,
          `$ ${(detail.quantity * price).toFixed(2).toLocaleString()}`,
        ]);
      });
    } else {
      tableData.push([
        1,
        appointment.tutor_services.name || '',
        '',
        `$ ${price.toLocaleString()}`,
        1,
        `$ ${price.toLocaleString()}`,
      ]);
    }
    return tableData;
  };

  const printPDF = async (appointment: any) => {
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: false,
      fileName: `Tutor-${appointment.tutor_services.tutors.name}-${appointment.id}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: logo,
        width: 25,
        height: 25,
        margin: {
          top: 0,
          left: 0,
        },
      },
      stamp: {
        inAllPages: true,
        src: '',
        width: 20,
        height: 20,
        margin: {
          top: 0,
          left: 0,
        },
      },
      business: {
        name: 'Tutor',
        address: 'https://tutor-app.netlify.app/',
        phone: '',
        email: '',
        website: '',
      },
      contact: {
        label: t('common.documentFor'),
        name: userType === 'user' ? appointment.user_profiles.name : appointment.tutor_services.tutors.name,
        address: '',
        phone: '',
        email: '',
      },
      invoice: {
        label: ``,
        num: ``,
        invDate: ``,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: '#',
            style: {
              width: 10,
            },
          },
          {
            title: t('common.detail'),
            style: {
              width: 50,
            },
          },
          {
            title: t('common.description'),
            style: {
              width: 50,
            },
          },
          {
            title: t('common.unitPrice'),
            style: {
              width: 30,
            },
          },
          { title: t('common.quantity') },
          { title: t('common.totalPrice') },
        ],
        table: createTableData(appointment),
        additionalRows: [
          {
            col1: t('common.subtotalPrice'),
            col2: `$ ${calcAppointmentPrice(appointment).toLocaleString()}`,
            style: {
              fontSize: 10,
            },
          },
          {
            col1: t('common.serviceChargePrice'),
            col2: `$ ${calcServiceChargePrice(appointment).toLocaleString()}`,
            style: {
              fontSize: 10,
            },
          },
          {
            col1: t('common.totalPrice'),
            col2: `$ ${(calcAppointmentPrice(appointment) + calcServiceChargePrice(appointment)).toLocaleString()}`,
            style: {
              fontSize: 10,
            },
          },
        ],
      },
      footer: {
        text: t('common.printFooter'),
      },
      pageEnable: true,
      pageLabel: t('common.page'),
    };
    jsPDFInvoiceTemplate(props);
  };

  const genTutorExtra = (appointment: any) => {
    switch (appointment.status) {
      case APPOINTMENT_STATUS.IN_PROGRESS:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  danger
                  onClick={() => changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.REJECTED })}
                >
                  {t('common.cancelAppointment')}
                </Button>

                <Button
                  size="small"
                  type="primary"
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  onClick={() =>
                    changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.PENDING_PAYMENT })
                  }
                >
                  {t('common.requestPayment')}
                </Button>
              </>
            )}
          </Space>
        );
      case APPOINTMENT_STATUS.PENDING_PAYMENT:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <>
                <Button
                  size="small"
                  type="primary"
                  danger
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  onClick={() => changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.REPORTED })}
                >
                  {t('common.reportAppointment')}
                </Button>
              </>
            )}
          </Space>
        );
      case APPOINTMENT_STATUS.COMPLETE:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <Tooltip title={t('common.print')}>
                <Button
                  size="small"
                  type="primary"
                  shape="circle"
                  icon={<FilePdfOutlined />}
                  onClick={() => printPDF(appointment)}
                />
              </Tooltip>
            )}
          </Space>
        );
      default:
        return <></>;
    }
  };

  const genUserExtra = (appointment: any) => {
    switch (appointment.status) {
      case APPOINTMENT_STATUS.PENDING_APPROVAL:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  danger
                  onClick={() => changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.REJECTED })}
                >
                  {t('common.cancelAppointment')}
                </Button>
              </>
            )}
          </Space>
        );
      case APPOINTMENT_STATUS.IN_PROGRESS:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Button
                  size="small"
                  type="primary"
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  danger
                  onClick={() => handleCancelWithFee(appointment)}
                >
                  {t('common.cancelAppointment')}
                </Button>
                <small
                  style={{
                    color: 'var(--text-plain-color)',
                    fontSize: '0.8em',
                    padding: '1em 0.5em',
                  }}
                >
                  {t('common.cancelWithFee')}
                </small>
              </div>
            )}
          </Space>
        );
      case APPOINTMENT_STATUS.PENDING_PAYMENT:
        return (
          <Space wrap>
            {isLoadingCreatePreference ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    fontSize: '0.8em',
                    width: '10em',
                  }}
                  onClick={() => handlePayment(appointment)}
                >
                  {t('common.payAppointment')}
                </Button>
              </>
            )}
          </Space>
        );
      case APPOINTMENT_STATUS.COMPLETE:
        return (
          <Space wrap>
            {isLoadingChangeAppointmentStatus ? (
              <Button size="small" type="text" shape="circle" icon={<Spin />} />
            ) : (
              <>
                <Tooltip title={t('common.reviewAppointment')}>
                  <Button
                    size="small"
                    type="primary"
                    shape="circle"
                    icon={<CommentOutlined />}
                    onClick={() => handleReview(appointment)}
                  />
                </Tooltip>
                <Tooltip title={t('common.print')}>
                  <Button
                    size="small"
                    type="primary"
                    shape="circle"
                    icon={<FilePdfOutlined />}
                    onClick={() => printPDF(appointment)}
                  />
                </Tooltip>
              </>
            )}
          </Space>
        );
      default:
        return <></>;
    }
  };

  const goBack = () => {
    navigate('/home');
  };

  const calcAppointmentPrice = (appointment: any) => {
    const { price, is_unit_price } = appointment.tutor_services;
    let total_price = 0;
    if (is_unit_price) {
      appointment.appointment_details.forEach((detail: any) => {
        total_price += detail.quantity * price;
      });
    } else {
      total_price = price;
    }
    return total_price;
  };
  const calcServiceChargePrice = (appointment: any) => {
    const { price, is_unit_price } = appointment.tutor_services;
    let total_price = 0;
    if (is_unit_price) {
      appointment.appointment_details.forEach((detail: any) => {
        total_price += detail.quantity * price;
      });
    } else {
      total_price = price;
    }
    return total_price * parseFloat(process.env.REACT_APP_MP_SERVICE_CHARGE || '');
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING_APPROVAL:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--secondary-color)',
        };
      case APPOINTMENT_STATUS.REJECTED:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--text-plain-color)',
        };
      case APPOINTMENT_STATUS.IN_PROGRESS:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--primary1-color)',
        };
      case APPOINTMENT_STATUS.PENDING_PAYMENT:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--warning-color)',
        };
      case APPOINTMENT_STATUS.COMPLETE:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--success-color)',
        };
      case APPOINTMENT_STATUS.REPORTED:
        return {
          color: 'var(--text-secondary-color)',
          backgroundColor: 'var(--error-color)',
        };
      default:
        return {
          color: 'var(--primary-color)',
          backgroundColor: 'var(--primary-color-light)',
        };
    }
  };

  const computedAddress = (address: any) => {
    if (address === null) return t(`constants.location.${LOCATION_TYPE[2]}`);

    return `${address.street}, ${address.number} - ${address.province}, ${address.country}`;
  };

  const filterExport = (appointments: any) => {
    return appointments.map((appointment: any) => {
      return {
        id: appointment.id,
        name: appointment.tutor_services.name,
        creationDate: moment(appointment.created).format('DD/MM/YYYY HH:mm'),
        date: moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm'),
        offeredBy: appointment.tutor_services.tutors.name,
        receivedBy: appointment.user_profiles.name,
        location: computedAddress(appointment.addresses),
        status: t(`constants.appointment_status.${appointment.status}`),
        price: calcAppointmentPrice(appointment),
      };
    });
  };

  if (isLoadingUserType || isLoadingUserAppointments || isLoadingTutorAppointments) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.appointments')}</PageTitle>
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
          {t('common.appointments')}
        </h1>
        <ShareButton list={filterExport(filteredAppointments())} fileName="appointments" />
      </Row>
      <Row>{/* TODO: sort by */}</Row>
      <Row>
        <Select
          placeholder={t('common.filterByStatus')}
          style={{
            margin: '1rem',
            width: '100%',
          }}
          value={statusFilter}
          onChange={(value: any) => setStatusFilter(value)}
          allowClear
          options={[
            { value: '', label: t('common.filterByStatus'), disabled: true },
            ...Object.values(APPOINTMENT_STATUS)
              .map((status) => ({
                value: status,
                label: t(`constants.appointment_status.${status}`),
              }))
              .filter((status) => (userType === 'tutor' ? status.value !== APPOINTMENT_STATUS.PENDING_APPROVAL : true)),
          ]}
        />
      </Row>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="start"
        style={{
          margin: '0.5em',
          border: 'none',
          boxShadow: '0px 10px 10px 0px #00000022',
          backgroundColor: 'var(--sider-background-color)',
        }}
      >
        {filteredAppointments()?.map((appointment: any) => {
          return (
            <React.Fragment key={appointment.id}>
              {userType === 'tutor' ? (
                <Panel
                  style={{
                    border: 'none',
                  }}
                  header={
                    <p style={{ fontSize: '0.8em', margin: 5 }}>
                      <strong>{t('common.name')}: </strong>
                      {appointment.tutor_services.name}
                    </p>
                  }
                  key={appointment.id}
                  extra={
                    <p
                      style={{
                        marginLeft: '26px',
                        fontSize: '0.8em',
                        borderRadius: '50px',
                        width: 'fit-content',
                        whiteSpace: 'nowrap',
                        padding: '0.2em 1em',
                        ...statusBadge(appointment.status),
                      }}
                    >
                      {t(
                        `constants.appointment_status.${Object.values(APPOINTMENT_STATUS).find(
                          (status) => status === appointment.status,
                        )}`,
                      )}
                    </p>
                  }
                >
                  <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                    <strong>{t('common.creationDate')}: </strong>
                    {moment(appointment.created).format('DD/MM/YYYY HH:mm')}hs
                  </p>
                  <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                    <strong>{t('common.datetime')}: </strong>
                    {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                  </p>
                  <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                    <strong>{t('common.location')}: </strong>
                    {computedAddress(appointment.addresses)}
                  </p>
                  {appointment.appointment_details?.length > 0 && (
                    <>
                      <Button
                        type="link"
                        style={{
                          marginLeft: '26px',
                          marginTop: '-20px',
                          padding: '0',
                          fontSize: '0.8em',
                        }}
                        onClick={() => {
                          setShowDetails(true);
                        }}
                      >
                        {t('common.showDetails')}
                      </Button>
                      <Modal
                        title={t('common.appointmentDetails')}
                        visible={showDetails}
                        onCancel={() => setShowDetails(false)}
                        footer={null}
                      >
                        {appointment.appointment_details?.map((detail: any, i: any) => (
                          <Collapse
                            key={i}
                            defaultActiveKey={['0']}
                            expandIconPosition="start"
                            style={{
                              border: 'none',
                              width: '100%',
                              backgroundColor: 'var(--sider-background-color)',
                            }}
                            collapsible={appointment.appointment_details?.additional_details ? 'header' : 'disabled'}
                          >
                            <Panel
                              key={`${i}-panel`}
                              style={{
                                border: 'none',
                              }}
                              showArrow={!!appointment.appointment_details?.additional_details}
                              header={
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <span style={{ fontSize: '0.8em', color: 'var(--text-light-color)' }}>
                                    <strong>{t('common.name')}: </strong>
                                    {detail.detail}
                                  </span>
                                  <span style={{ fontSize: '0.8em', color: 'var(--primary-color)' }}>
                                    {detail.quantity} u.
                                  </span>
                                </div>
                              }
                            >
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
                          </Collapse>
                        ))}
                      </Modal>
                    </>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                      <strong>{t('common.totalPrice')}: </strong>${calcAppointmentPrice(appointment)}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {genTutorExtra(appointment)}
                  </div>
                </Panel>
              ) : (
                <Panel
                  style={{
                    border: 'none',
                  }}
                  header={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <p style={{ fontSize: '0.8em', margin: 5 }}>
                        <strong>{t('common.name')}: </strong>
                        {appointment.tutor_services.name}
                      </p>
                      <small style={{ fontSize: '0.7em', color: 'var(--text-plain-color)', padding: '0.5em' }}>
                        {t('common.offeredBy', { tutor: appointment.tutor_services.tutors.name })}
                      </small>
                    </div>
                  }
                  key={appointment.id}
                  extra={
                    <p
                      style={{
                        marginLeft: '26px',
                        fontSize: '0.8em',
                        borderRadius: '50px',
                        width: 'fit-content',
                        whiteSpace: 'nowrap',
                        padding: '0.2em 1em',
                        ...statusBadge(appointment.status),
                      }}
                    >
                      {t(
                        `constants.appointment_status.${Object.values(APPOINTMENT_STATUS).find(
                          (status) => status === appointment.status,
                        )}`,
                      )}
                    </p>
                  }
                >
                  <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                    <strong>{t('common.creationDate')}: </strong>
                    {moment(appointment.created).format('DD/MM/YYYY HH:mm')}hs
                  </p>
                  <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                    <strong>{t('common.datetime')}: </strong>
                    {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                  </p>
                  {appointment.status === APPOINTMENT_STATUS.IN_PROGRESS && (
                    <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                      <strong>{t('common.location')}: </strong>
                      {computedAddress(appointment.addresses)}
                    </p>
                  )}
                  {appointment.appointment_details?.length > 0 && (
                    <>
                      <Button
                        type="link"
                        style={{
                          marginLeft: '26px',
                          marginTop: '-20px',
                          padding: '0',
                          fontSize: '0.8em',
                        }}
                        onClick={() => {
                          setShowDetails(true);
                        }}
                      >
                        {t('common.showDetails')}
                      </Button>
                      <Modal
                        title={t('common.appointmentDetails')}
                        visible={showDetails}
                        onCancel={() => setShowDetails(false)}
                        footer={null}
                      >
                        {appointment.appointment_details?.map((detail: any, i: any) => (
                          <Collapse
                            key={i}
                            defaultActiveKey={['0']}
                            expandIconPosition="start"
                            style={{
                              border: 'none',
                              width: '100%',
                              backgroundColor: 'var(--sider-background-color)',
                            }}
                            collapsible={appointment.appointment_details?.additional_details ? 'header' : 'disabled'}
                          >
                            <Panel
                              key={`${i}-panel`}
                              style={{
                                border: 'none',
                              }}
                              showArrow={!!appointment.appointment_details?.additional_details}
                              header={
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <span style={{ fontSize: '0.8em', color: 'var(--text-light-color)' }}>
                                    <strong>{t('common.name')}: </strong>
                                    {detail.detail}
                                  </span>
                                  <span style={{ fontSize: '0.8em', color: 'var(--primary-color)' }}>
                                    {detail.quantity} u.
                                  </span>
                                </div>
                              }
                            >
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
                          </Collapse>
                        ))}
                      </Modal>
                    </>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
                      <strong>{t('common.totalPrice')}: </strong>${calcAppointmentPrice(appointment)}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {genUserExtra(appointment)}
                  </div>
                </Panel>
              )}
            </React.Fragment>
          );
        })}
      </Collapse>
    </>
  );
};
