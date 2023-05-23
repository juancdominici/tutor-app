import { getServiceStatistics, getUserStatistics } from '@app/api/users.api';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { Legend } from '@app/components/common/charts/Legend/Legend';
import { PieChart } from '@app/components/common/charts/PieChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Divider, Empty, Radio, Row, Statistic } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [dateDiff, setDateDiff] = useState<any>('week');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [data, setData] = useState<{ data: any[]; xAxisData: any[] }>({
    data: [],
    xAxisData: [],
  });

  const {
    data: statistics,
    isLoading,
    isFetching,
  } = useQuery(['statistics', dateDiff], async () => getUserStatistics(dateDiff), {
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    onSuccess: (data) => {
      setData({ data: data.userCountArr, xAxisData: data.days });
    },
  });
  const { data: serviceStatistics } = useQuery(
    ['serviceStatistics', dateDiff],
    async () => getServiceStatistics(dateDiff),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: false,
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
      name: t('common.newUsersCount'),
      nameTextStyle: {
        padding: [0, -24],
        align: 'left',
        fontSize: 16,
      },
      minInterval: 1,
      max: data.data.length > 0 ? Math.max(...data.data) + Math.round(Math.max(...data.data) / 2) : 0,
    },
    series: [
      {
        name: t('common.newUsersCount'),
        type: 'bar',
        data: data.data,
        color: themeObject[theme].chartColor4,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 1,
      },
    ],
  };

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
            <Col span={8}>
              <Statistic
                title={t('common.userCount')}
                style={{
                  textAlign: 'center',
                }}
                loading={isLoading || isFetching}
                value={statistics?.userCount}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={t('common.activeUserCount')}
                style={{
                  textAlign: 'center',
                }}
                loading={isLoading || isFetching}
                value={statistics?.activeUserCount}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={t('common.newUsersCount')}
                style={{
                  textAlign: 'center',
                }}
                loading={isLoading || isFetching}
                value={statistics?.newUsersCount}
              />
            </Col>
          </Row>
          {data?.data?.some((e) => !!e) ? (
            <BaseChart option={option} />
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
        </Card>
      </Col>

      <Col
        span={24}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: '1em',
          marginBottom: '2em',
        }}
      >
        <Card
          style={{
            width: '95%',
          }}
          title={t('common.appointmentsByServiceType')}
        >
          {serviceStatistics?.appointmentsByServiceType?.some((e: any) => !!e.value) ? (
            <>
              <PieChart data={serviceStatistics?.appointmentsByServiceType} />
              <Legend
                legendItems={serviceStatistics?.appointmentsByServiceType || []}
                activeItemIndex={activeItemIndex}
              />
            </>
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
        </Card>
      </Col>
      <Row
        style={{
          position: 'sticky',
          bottom: 30,
          zIndex: 1,
        }}
      >
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Radio.Group value={dateDiff} onChange={(e) => setDateDiff(e.target.value)}>
            <Radio.Button value={'week'}>{t('common.lastWeek')}</Radio.Button>
            <Radio.Button value={'month'}>{t('common.lastMonth')}</Radio.Button>
            <Radio.Button value={'year'}>{t('common.lastYear')}</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Divider />
      <h1
        style={{
          fontWeight: 500,
          padding: '0 1rem',
          margin: '0',
          color: 'var(--primary-color)',
        }}
      >
        {t('common.fullInformation')}
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
          }}
          title={t('common.userTypeCount')}
        >
          <PieChart data={statistics?.userTypeCount} />
          <Legend legendItems={statistics?.userTypeCount || []} activeItemIndex={activeItemIndex} />
        </Card>
      </Col>
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
          }}
          title={t('common.providerCount')}
        >
          <PieChart data={statistics?.providerCount} />
          <Legend legendItems={statistics?.providerCount || []} activeItemIndex={activeItemIndex} />
        </Card>
      </Col>
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
          }}
          title={t('common.serviceByCategoryCount')}
        >
          <PieChart data={serviceStatistics?.serviceByCategoryCount} />
          <Legend legendItems={serviceStatistics?.serviceByCategoryCount || []} activeItemIndex={activeItemIndex} />
        </Card>
      </Col>
      <Col
        span={24}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: '1em',
          marginBottom: '5em',
        }}
      >
        <Card
          style={{
            width: '95%',
          }}
          title={t('common.serviceByLocationTypeCount')}
        >
          <PieChart data={serviceStatistics?.serviceByLocationTypeCount} />
          <Legend legendItems={serviceStatistics?.serviceByLocationTypeCount || []} activeItemIndex={activeItemIndex} />
        </Card>
      </Col>
    </Row>
  );
};
