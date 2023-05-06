import React from 'react';
import Overlay from '../../../common/Overlay';
import { Button, Card, Col, Drawer, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getTutorNotifications, getUserNotifications } from '@app/api/dashboard.api';
import { checkUserExistance } from '@app/api/auth.api';
import { Notification } from '@app/components/common/Notification/Notification';
import { Panel } from '@app/components/common/Collapse/Collapse';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { APPOINTMENT_STATUS, LOCATION_TYPE } from '@app/constants/constants';
import { useLanguage } from '@app/hooks/useLanguage';

const NotificationDrawer = ({ isOpen, setOpen }: any) => {
  const toggleSider = () => setOpen(!isOpen);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const formatter = new Intl.RelativeTimeFormat(language);

  const { data: userType, isFetching } = useQuery(['userType'], () => checkUserExistance(), {
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { data: userNotifications, isFetching: isLoadingUserNotifications } = useQuery(
    ['user-notifications'],
    () => getUserNotifications(),
    {
      enabled: userType === 'user',
      refetchOnWindowFocus: false,
    },
  );
  const { data: tutorNotifications, isFetching: isLoadingTutorNotifications } = useQuery(
    ['tutor-notifications'],
    () => getTutorNotifications(),
    {
      enabled: userType === 'tutor',
      refetchOnWindowFocus: false,
    },
  );

  const computedAddress = (address: any) => {
    if (address === null) return t(`constants.location.${LOCATION_TYPE[2]}`);

    return `${address.street}, ${address.number} - ${address.province}, ${address.country}`;
  };

  const computedStatus = (appointment: any) => {
    switch (appointment.status) {
      case APPOINTMENT_STATUS.PENDING_APPROVAL:
        return t(`notifications.appointments.${APPOINTMENT_STATUS.PENDING_APPROVAL}`);
      case APPOINTMENT_STATUS.REJECTED:
        return t(`notifications.appointments.${APPOINTMENT_STATUS.REJECTED}`);
      case APPOINTMENT_STATUS.PENDING_PAYMENT:
        return t(`notifications.appointments.${APPOINTMENT_STATUS.PENDING_PAYMENT}`);
      case APPOINTMENT_STATUS.COMPLETE:
        return t(`notifications.appointments.${APPOINTMENT_STATUS.COMPLETE}`);
      case APPOINTMENT_STATUS.REPORTED:
        return t(`notifications.appointments.${APPOINTMENT_STATUS.REPORTED}`);
    }
  };

  const computedNotificationColor = (appointment: any) => {
    switch (appointment.status) {
      case APPOINTMENT_STATUS.PENDING_APPROVAL:
        return {
          borderLeft: '10px solid rgba(var(--secondary-rgb-color), 0.7)',
        };
      case APPOINTMENT_STATUS.PENDING_PAYMENT:
        return {
          borderLeft: '10px solid rgba(var(--warning-rgb-color), 0.7)',
        };
      case APPOINTMENT_STATUS.COMPLETE:
        return {
          borderLeft: '10px solid rgba(var(--success-rgb-color), 0.7)',
        };
      default:
        return {
          borderLeft: '10px solid rgba(var(--error-rgb-color), 0.7)',
        };
    }
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

  return (
    <>
      <Drawer
        placement="bottom"
        visible={isOpen}
        onClose={() => setOpen(false)}
        getContainer={false}
        closable={false}
        bodyStyle={{
          padding: '1em',
        }}
      >
        <Row justify="space-between">
          <Col>
            <h3 style={{ margin: 0 }}>{t('common.notifications')}</h3>
          </Col>
        </Row>
        {isFetching || isLoadingUserNotifications || isLoadingTutorNotifications ? (
          <Spin />
        ) : (
          <div>
            {userNotifications?.map((appointment: any) => (
              <Card
                key={appointment.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '1em 0',
                  ...computedNotificationColor(appointment),
                }}
              >
                <Row justify="space-between">
                  <Col>
                    <small style={{ fontSize: '0.7em', color: 'var(--secondary-color)', padding: '0.5em' }}>
                      {t('common.service')}: {appointment.tutor_services.name}
                    </small>
                  </Col>
                  <Col>
                    <small style={{ fontSize: '0.7em', color: 'var(--text-plain-color)', padding: '0.5em' }}>
                      {formatter.format(
                        Math.round((new Date(appointment?.last_modified).getTime() - Date.now()) / (1000 * 3600 * 24)),
                        'days',
                      )}
                    </small>
                  </Col>
                  <Col span={24}>
                    <small style={{ fontSize: '0.7em', color: 'var(--text-plain-color)', padding: '0.5em' }}>
                      {t('common.offeredBy', { tutor: appointment.tutor_services.tutors.name })}
                    </small>
                  </Col>
                  <Col span={24}>
                    <p style={{ fontSize: '0.8em', margin: 5, whiteSpace: 'pre-line' }}>
                      {computedStatus(appointment)}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))}
            {tutorNotifications?.map((appointment: any) => (
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
              </Panel>
            ))}
            {userNotifications?.length === 0 && tutorNotifications?.length === 0 && <div>No notifications</div>}
          </div>
        )}
      </Drawer>
      <Overlay onClick={toggleSider} show={isOpen} />
    </>
  );
};

export default NotificationDrawer;
