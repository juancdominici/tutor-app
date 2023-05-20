import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTutorAppointmentsStatistics } from '../api/appointments.api';
import { Card, Carousel, Col, Empty, Radio, Row, Typography } from 'antd';
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PieChartRightLegend } from '@app/components/common/charts/PieChartCustomLegend';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [dateDiff, setDateDiff] = useState<any>('week');

  const { data: tutorAppointmentsStatistics } = useQuery(
    ['tutorAppointmentsStatistics', dateDiff],
    async () => getTutorAppointmentsStatistics(dateDiff),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

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
          <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
            {tutorAppointmentsStatistics?.pendingRequests?.map((appointment) => (
              <div key={appointment.id}>
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
                      ${appointment.tutor_services.price}
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
                  <Col span={24}>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                    </p>
                  </Col>
                </Row>
              </div>
            ))}
            {tutorAppointmentsStatistics?.pendingRequests?.length === 0 && (
              <Empty
                description={''}
                style={{
                  marginTop: '2em',
                  fontSize: '0.8em',
                }}
                imageStyle={{
                  height: 60,
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
          <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
            {tutorAppointmentsStatistics?.closeAppointments?.map((appointment) => (
              <div key={appointment.id}>
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
                      ${appointment.tutor_services.price}
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
                  <Col span={24}>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        paddingLeft: '0.5em',
                      }}
                    >
                      {moment(`${appointment.date} ${appointment.time}`).format('DD/MM/YYYY HH:mm')}hs
                    </p>
                  </Col>
                </Row>
              </div>
            ))}
            {tutorAppointmentsStatistics?.closeAppointments?.length === 0 && (
              <Empty
                description={''}
                style={{
                  marginTop: '2em',
                  fontSize: '0.8em',
                }}
                imageStyle={{
                  height: 60,
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
              <PieChartRightLegend data={tutorAppointmentsStatistics?.appointmentsPerService} />
            </Col>

            <Col span={24}>
              <Typography style={{ textAlign: 'center', fontSize: '0.9em', margin: '1em' }}>
                {t('common.appointmentsPerServiceWithPrice')}
              </Typography>
              <PieChartRightLegend data={tutorAppointmentsStatistics?.appointmentsPerServiceWithPrice} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
