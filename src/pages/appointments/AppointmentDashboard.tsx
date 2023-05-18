import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, DatePicker, Form, Radio, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAppointmentStatistics } from '@app/api/appointments.api';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { APPOINTMENT_STATUS } from '@app/constants/constants';

export const AppointmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  const [dateDiff, setDateDiff] = useState<any>('week');
  const [appointmentType, setAppointmentType] = useState<any>('');
  const [data, setData] = useState<{ data: any[]; xAxisData: any[] }>({
    data: [],
    xAxisData: [],
  });

  const { data: appointmentStatistics } = useQuery(
    ['appointmentStatistics', dateDiff, appointmentType],
    async () => getAppointmentStatistics(dateDiff, appointmentType),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setData({ data: data.userCountArr, xAxisData: data.days });
      },
    },
  );

  const option = {
    grid: {
      left: 20,
      right: 20,
      bottom: 0,
      top: 70,
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      data: data.xAxisData,
      minInterval: 1,
    },
    yAxis: {
      name:
        appointmentStatistics?.userType === 'tutor'
          ? t('common.tutorAppointmentsDashboard', { period: t(`constants.periods.${appointmentType || 'complete'}`) })
          : t('common.userAppointmentsDashboard', { period: t(`constants.periods.${appointmentType || 'complete'}`) }),
      nameTextStyle: {
        padding: [0, -24],
        align: 'left',
        fontSize: 12,
      },
      minInterval: 1,
      max: data.data.length > 0 ? Math.max(...data.data) + Math.round(Math.max(...data.data) / 2) : 0,
    },
    series: [
      {
        name: t('common.totalPrice'),
        type: 'bar',
        data: data.data,
        prefix: '$',
        color: themeObject[theme].chartColor4,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 1,
      },
    ],
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageTitle>{t('common.historicData')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
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
            flexDirection: 'column',
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
                <BaseChart
                  option={option}
                  style={{
                    maxHeight: '50vh',
                  }}
                />
              </Col>
            </Row>
          </Card>
          <Row>
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Select
                placeholder={t('common.filterByStatus')}
                style={{
                  margin: '0.5rem',
                  width: '100%',
                }}
                value={appointmentType}
                onChange={(value: any) => setAppointmentType(value)}
                allowClear
                options={[
                  { value: '', label: t('common.filterByStatus'), disabled: true },
                  ...Object.values(APPOINTMENT_STATUS)
                    .map((status) => ({
                      value: status,
                      label: t(`constants.appointment_status.${status}`),
                    }))
                    .filter((status) => status.value !== APPOINTMENT_STATUS.PENDING_APPROVAL),
                ]}
              />
              <Radio.Group value={dateDiff} onChange={(e) => setDateDiff(e.target.value)}>
                <Radio.Button value={'week'}>{t('common.lastWeek')}</Radio.Button>
                <Radio.Button value={'month'}>{t('common.lastMonth')}</Radio.Button>
                <Radio.Button value={'year'}>{t('common.lastYear')}</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
