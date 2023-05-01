import { getAppointmentById } from '@app/api/appointments.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { changeAppointmentStatus as changeAppointmentStatusAction } from '../../api/appointments.api';
import { APPOINTMENT_STATUS } from '@app/constants/constants';
import { Loading } from '@app/components/common/Loading';

export const AppointmentPaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, successUuid } = useParams();
  const queryClient = useQueryClient();

  const { data: appointment } = useQuery([], () => getAppointmentById(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: changeAppointmentStatus, isLoading: isLoadingChangeAppointmentStatus } = useMutation(
    changeAppointmentStatusAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_appointments']);
        queryClient.invalidateQueries(['tutor_appointments']);
        localStorage.removeItem('successUuid');
      },
      onError: () => {
        navigate('/appointments');
      },
    },
  );

  useEffect(() => {
    if (successUuid) {
      if (localStorage.getItem('successUuid') === successUuid) {
        changeAppointmentStatus({ id, status: APPOINTMENT_STATUS.COMPLETE });
      }
    }
  }, [successUuid]);

  if (isLoadingChangeAppointmentStatus) return <Loading />;

  return (
    <Row align="middle" justify="center">
      <PageTitle>{(t('notifications.payedAppointment'), { service: appointment?.tutor_services.name })}</PageTitle>
      <Col span={24}>
        <div
          style={{
            margin: '50px auto auto auto',
          }}
        >
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <div
          style={{
            padding: '30px',
          }}
        >
          <p
            style={{
              fontSize: '2em',
              textAlign: 'center',
            }}
          >
            {(t('notifications.payedAppointment'), { service: appointment?.tutor_services.name })}
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.payedAppointmentCaption')}
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.payedAppointmentSubCaption')},{' '}
            <Link to="/appointments">{t('notifications.payedAppointmentRedirect')}</Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};
