import React from 'react';
import Overlay from '../../../common/Overlay';
import { Card, Col, Drawer, Empty, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getTutorNotifications, getUserNotifications } from '@app/api/dashboard.api';
import { checkUserExistance } from '@app/api/auth.api';

import { useTranslation } from 'react-i18next';
import { APPOINTMENT_STATUS } from '@app/constants/constants';
import moment from 'moment';

const NotificationDrawer = ({ isOpen, setOpen }: any) => {
  const toggleSider = () => setOpen(!isOpen);
  const { t } = useTranslation();

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

  const computedDate = (date: any) => {
    const dateObj = new Date(date);
    return moment(dateObj).format('DD/MM/YYYY - HH:mm') + 'hs';
  };

  return (
    <>
      <Drawer
        placement="bottom"
        visible={isOpen}
        onClose={() => setOpen(false)}
        getContainer={false}
        closable={false}
        style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 1001,
        }}
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
                      {computedDate(appointment?.last_modified)}
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
                  <Col
                    span={14}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <small style={{ fontSize: '0.7em', color: 'var(--secondary-color)', padding: '0.5em' }}>
                      {t('common.service')}: {appointment.tutor_services.name}
                    </small>
                  </Col>
                  <Col
                    span={10}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <small
                      style={{
                        fontSize: '0.7em',
                        color: 'var(--text-plain-color)',
                        padding: '0.5em',
                        textAlign: 'end',
                      }}
                    >
                      {computedDate(appointment?.last_modified)}
                    </small>
                  </Col>
                  <Col span={24}>
                    <small style={{ fontSize: '0.7em', color: 'var(--text-plain-color)', padding: '0.5em' }}>
                      {t('common.priceBy', { price: `${calcAppointmentPrice(appointment)} ARS` })}
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
            {!userNotifications?.length && !tutorNotifications?.length && (
              <Empty
                description={t('common.nothingHere')}
                style={{
                  marginTop: '2em',
                }}
              />
            )}
          </div>
        )}
      </Drawer>
      <Overlay onClick={toggleSider} show={isOpen} />
    </>
  );
};

export default NotificationDrawer;
