import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTutorAppointmentsStatistics } from '../api/appointments.api';
import { Button, Card, Carousel, Col, Empty, Radio, Row, Typography } from 'antd';
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PieChartRightLegend } from '@app/components/common/charts/PieChartCustomLegend';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dateDiff, setDateDiff] = useState<any>('week');

  const { data: tutorAppointmentsStatistics } = useQuery(
    ['tutorAppointmentsStatistics', dateDiff],
    async () => getTutorAppointmentsStatistics(dateDiff),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    },
  );

  const isExpired = (date: string, time: string) => {
    const appointmentDate = moment(`${date} ${time}`);
    const currentDate = moment();
    return appointmentDate.isBefore(currentDate);
  };

  return (
    <Row align="middle" justify="center">
      <Col
        span={24}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'column',
          marginTop: '1em',
        }}
      >
        <Card
          style={{
            width: '95%',
            padding: '1em',
            marginBottom: '1em',
          }}
          bodyStyle={{
            padding: '0.5em',
          }}
        >
          <Typography style={{ textAlign: 'center', fontSize: '0.9em', marginBottom: '1em' }}>
            {t('common.pendingRequests')}
          </Typography>
          <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} dots={false}>
            {tutorAppointmentsStatistics?.pendingRequests?.map((appointment) => (
              <div key={appointment.id} className="carousel-item">
                <Row justify="space-between">
                  <Col span={18}>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {appointment.tutor_services.name}
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {appointment.tutor_services.price} ARS
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <p
                      style={{
                        color: 'var(--primary-color)',
                        fontSize: '0.7rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {appointment.user_profiles.name}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        paddingLeft: '0.5em',
                        color: isExpired(appointment.date, appointment.time)
                          ? 'var(--error-color)'
                          : 'var(--text-plain-color)',
                      }}
                    >
                      {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                    </p>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => navigate(`/tutor/requests`)}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0em 1.5em',
                      }}
                    >
                      {t('common.view')}
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            {tutorAppointmentsStatistics?.pendingRequests?.length === 0 && (
              <Empty
                description={
                  <span
                    style={{
                      fontSize: '0.8em',
                      color: 'var(--secondary-color)',
                    }}
                  >
                    {t('common.noElementsOnList')}
                  </span>
                }
                style={{
                  marginTop: '2em',
                }}
              />
            )}
          </Carousel>
        </Card>
        <Card
          style={{
            width: '95%',
            padding: '1em',
            marginBottom: '1em',
          }}
          bodyStyle={{
            padding: '0.5em',
          }}
        >
          <Typography style={{ textAlign: 'center', fontSize: '0.9em', marginBottom: '1em' }}>
            {t('common.closeAppointments')}
          </Typography>
          <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} dots={false}>
            {tutorAppointmentsStatistics?.closeAppointments?.map((appointment) => (
              <div key={appointment.id} className="carousel-item">
                <Row justify="space-between">
                  <Col span={18}>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {appointment.tutor_services.name}
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {appointment.tutor_services.price} ARS
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <p
                      style={{
                        color: 'var(--primary-color)',
                        fontSize: '0.7rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {appointment.user_profiles.name}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        paddingLeft: '0.5em',
                        color: isExpired(appointment.date, appointment.time)
                          ? 'var(--error-color)'
                          : 'var(--text-plain-color)',
                      }}
                    >
                      {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                    </p>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => navigate(`/appointments`)}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0em 1.5em',
                      }}
                    >
                      {t('common.view')}
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            {tutorAppointmentsStatistics?.closeAppointments?.length === 0 && (
              <Empty
                description={
                  <span
                    style={{
                      fontSize: '0.8em',
                      color: 'var(--secondary-color)',
                    }}
                  >
                    {t('common.noElementsOnList')}
                  </span>
                }
                style={{
                  marginTop: '2em',
                }}
              />
            )}
          </Carousel>
        </Card>
      </Col>
      <Col
        span={24}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
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
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Radio.Group
                style={{ transform: 'scale(0.8)' }}
                value={dateDiff}
                onChange={(e) => setDateDiff(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value={'week'}>{t('common.lastWeek')}</Radio.Button>
                <Radio.Button value={'month'}>{t('common.lastMonth')}</Radio.Button>
                <Radio.Button value={'year'}>{t('common.lastYear')}</Radio.Button>
              </Radio.Group>
            </Col>

            <Col span={24}>
              <Typography style={{ textAlign: 'center', fontSize: '0.9em', margin: '1em' }}>
                {t('common.appointmentsPerService')}
              </Typography>
              {tutorAppointmentsStatistics?.appointmentsPerService?.some((e: any) => !!e.value) ? (
                <PieChartRightLegend data={tutorAppointmentsStatistics?.appointmentsPerService} />
              ) : (
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: 'var(--secondary-color)',
                      }}
                    >
                      {t('common.noElementsOnListDashboard')}
                    </span>
                  }
                  style={{
                    margin: '2em 0',
                  }}
                />
              )}
            </Col>

            <Col span={24}>
              <Typography style={{ textAlign: 'center', fontSize: '0.9em', margin: '1em' }}>
                {t('common.appointmentsPerServiceWithPrice')}
              </Typography>
              {tutorAppointmentsStatistics?.appointmentsPerServiceWithPrice?.some((e: any) => !!e.value) ? (
                <PieChartRightLegend data={tutorAppointmentsStatistics?.appointmentsPerServiceWithPrice} />
              ) : (
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: 'var(--secondary-color)',
                      }}
                    >
                      {t('common.noElementsOnListDashboard')}
                    </span>
                  }
                  style={{
                    margin: '2em 0',
                  }}
                />
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
