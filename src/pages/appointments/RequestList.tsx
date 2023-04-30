import React, { useState } from 'react';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, Modal, Row, Space, Spin, Tooltip, Typography } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTutorRequests as getTutorRequestsAction,
  changeAppointmentStatus as changeAppointmentStatusAction,
} from '../../api/appointments.api';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { LOCATION_TYPE, APPOINTMENT_STATUS } from '@app/constants/constants';
import moment from 'moment';
const { Panel } = Collapse;
const { Paragraph } = Typography;

export const RequestList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<any>([]);
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();

  const { isFetching: isLoadingTutorRequests } = useQuery(['tutor_requests'], getTutorRequestsAction, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAppointments(data);
    },
  });

  const { mutate: changeAppointmentStatus, isLoading: isLoadingChangeAppointmentStatus } = useMutation(
    changeAppointmentStatusAction,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['tutor_requests']);
      },
    },
  );

  const filteredAppointments = () => {
    if (search) {
      return appointments?.filter(
        (appointment: any) =>
          t(`constants.location.${appointment.location}`).toLowerCase().includes(search.toLowerCase()) ||
          appointment.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return appointments;
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

  const computedAddress = (address: any) => {
    if (address === null) return t(`constants.location.${LOCATION_TYPE[2]}`);

    return `${address.street}, ${address.number} - ${address.province}, ${address.country}`;
  };

  if (isLoadingTutorRequests) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.requests')}</PageTitle>
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
          {t('common.requests')}
        </h1>
        <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }}>
          <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
      </Row>
      <Row>
        <Input
          placeholder={t('common.searchAppointment')}
          style={{
            margin: '0 1rem',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Row>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="start"
        style={{ margin: '0.5em', border: 'none', boxShadow: '0px 10px 10px 0px #00000022' }}
      >
        {filteredAppointments()?.map((appointment: any) => (
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
            <Space
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {isLoadingChangeAppointmentStatus ? (
                <Button size="small" type="text" shape="circle" icon={<Spin />} />
              ) : (
                <>
                  <Button
                    type="primary"
                    size="small"
                    shape="round"
                    danger
                    onClick={() => changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.REJECTED })}
                  >
                    <p style={{ fontSize: '0.8em' }}>{t('common.rejectRequest')}</p>
                  </Button>

                  <Button
                    type="primary"
                    size="small"
                    shape="round"
                    onClick={() =>
                      changeAppointmentStatus({ id: appointment.id, status: APPOINTMENT_STATUS.IN_PROGRESS })
                    }
                  >
                    <p style={{ fontSize: '0.8em' }}>{t('common.acceptRequest')}</p>
                  </Button>
                </>
              )}
            </Space>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};
