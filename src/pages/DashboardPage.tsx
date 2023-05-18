import { checkUserExistance } from '@app/api/auth.api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserAppointments as getUserAppointmentsAction,
  getTutorAppointments as getTutorAppointmentsAction,
} from '../api/appointments.api';
import { Card, Col, Row, Statistic } from 'antd';
import { BaseChart } from '@app/components/common/charts/BaseChart';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<any>([]);

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

  return (
    <Row align="middle" justify="center">
      <h1
        style={{
          fontWeight: 500,
          padding: '1rem',
          marginTop: '1rem',
          color: 'var(--primary-color)',
        }}
      >
        {t('common.historicData')}
      </h1>
      <Col
        span={24}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: '1em',
        }}
      >
        <Card
          style={{
            width: '95%',
            padding: '0 1em',
          }}
          bodyStyle={{
            padding: '0.5em',
          }}
        >
          <Row>
            <Col span={24}>
              <Statistic
                title={t('common.appointmentCount')}
                style={{
                  textAlign: 'center',
                }}
                loading={isLoadingUserType || isLoadingUserAppointments || isLoadingTutorAppointments}
                value={appointments.length}
              />
            </Col>
          </Row>

          <BaseChart option={appointments} />
        </Card>
      </Col>
    </Row>
  );
};
