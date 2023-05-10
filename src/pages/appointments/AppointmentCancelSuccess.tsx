import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { changeAppointmentStatus as changeAppointmentStatusAction } from '../../api/appointments.api';
import { APPOINTMENT_STATUS } from '@app/constants/constants';
import { Loading } from '@app/components/common/Loading';

export const AppointmentCancelSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, successUuid } = useParams();
  const queryClient = useQueryClient();

  const { mutate: changeAppointmentStatus, isLoading: isLoadingChangeAppointmentStatus } = useMutation(
    changeAppointmentStatusAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_appointments']);
        queryClient.invalidateQueries(['tutor_appointments']);
        localStorage.removeItem('successUuid');
        setTimeout(() => {
          navigate('/appointments');
        }, 5000);
      },
      onError: () => {
        navigate('/appointments');
      },
    },
  );

  useEffect(() => {
    if (successUuid && id) {
      if (localStorage.getItem('successUuid') === successUuid) {
        changeAppointmentStatus({ id, status: APPOINTMENT_STATUS.REJECTED });
      } else {
        navigate('/appointments');
      }
    }
  }, [successUuid, id]);

  if (isLoadingChangeAppointmentStatus) return <Loading />;

  return (
    <Row align="middle" justify="center">
      <PageTitle>{t('notifications.cancelledAppointmentEmpty')}</PageTitle>
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
            {t('notifications.cancelledAppointmentEmpty')}
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.cancelledAppointmentCaption')}
          </p>
          <p
            style={{
              fontSize: '1em',
              textAlign: 'center',
            }}
          >
            {t('notifications.cancelledAppointmentSubCaption')},{' '}
            <Link to="/appointments">{t('notifications.cancelledAppointmentRedirect')}</Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};
