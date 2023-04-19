import { ArrowLeftOutlined, DoubleLeftOutlined, DoubleRightOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getTutorAddresses } from '@app/api/addresses.api';
import { getTutorProfileData } from '@app/api/auth.api';
import { getTutorQuestions, getTutorReviews, getTutorServices } from '@app/api/profiles.api';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Rate, Row, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const { Paragraph } = Typography;
  const [service, setService] = useState<any>(null);
  const [slide, setSlide] = useState('1');

  const { data: tutorProfileData, isLoading } = useQuery(['userData', id], () => getTutorProfileData(id), {
    enabled: !!id,
    onSuccess: (data) => {
      if (!data) {
        navigate('/404');
      }
    },
  });

  const [tutorAddressesQuery, tutorReviewsQuery, tutorQuestionsQuery, tutorServicesQuery] = useQueries({
    queries: [
      {
        queryKey: ['tutorAddresses', id],
        queryFn: () => getTutorAddresses(id),
        enabled: !!id,
      },
      {
        queryKey: ['tutorReviews', id],
        queryFn: () => getTutorReviews(id),
        enabled: !!id,
      },
      {
        queryKey: ['tutorQuestions', id],
        queryFn: () => getTutorQuestions(id),
        enabled: !!id,
      },
      {
        queryKey: ['tutorServices', id],
        queryFn: () => getTutorServices(id),
        enabled: !!id,
      },
    ],
  });

  const goBack = () => {
    navigate('/home');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.addresses')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>

        <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }}>
          <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
      </Row>
      <Row align="middle" justify="space-around">
        <Col span={10}>
          <img
            src={`https://source.boringavatars.com/beam/120/${tutorProfileData?.name?.split(' ')[0]}%20${
              tutorProfileData?.name?.split(' ')[1]
            }?colors=3ECF8E,1A1E22,008640,F8FBFF`}
            alt="user-avatar"
            referrerPolicy="no-referrer"
            style={{
              borderRadius: '50%',
              padding: '2px',
              boxShadow: '0 0 0 1px #f3f3f333',
              pointerEvents: 'none',
              width: '5em',
              height: '5em',
              marginLeft: '2em',
            }}
          />
        </Col>
        {slide === '1' ? (
          <>
            <Col span={14}>
              <div>
                <span>{tutorProfileData?.name}</span>
              </div>
              <Rate
                style={{
                  fontSize: '1.2em',
                  display: 'flex',
                  margin: '0 0.5em 0 0',
                }}
                value={tutorProfileData?.avg_score}
                allowHalf
                disabled
              />
              <div>
                <span
                  style={{
                    fontSize: '0.8em',
                  }}
                >
                  {tutorProfileData?.review_count === 1
                    ? t('common.review', {
                        count: tutorProfileData?.review_count,
                      })
                    : t('common.reviews', {
                        count: tutorProfileData?.review_count,
                      })}
                </span>
              </div>
              <Button
                style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-25%)' }}
                type="link"
                onClick={() => setSlide('2')}
              >
                <DoubleRightOutlined />
              </Button>
            </Col>
            <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* <Select
                style={{ width: '90%', margin: '1em 0', fontSize: '0.8em' }}
                size="small"
                value={address}
                options={tutorAddressesQuery?.data?.map((address) => ({
                  value: address.id,
                  label: `${address.street} ${address.number}, ${address.province} - ${address.country}, ${address.postcode}`,
                }))}
                onChange={(value) => setAddress(value)}
              /> */}
              <Row align="middle" justify="space-around" style={{ margin: '1em 0' }}>
                <img
                  src={require('../../assets/images/marker.png').default}
                  alt="map-marker"
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    cursor: 'pointer',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8em',
                    textAlign: 'center',
                  }}
                >
                  {state.address.street} {state.address.number} - {state.address.province}
                </span>
              </Row>
            </Col>
          </>
        ) : (
          <Col span={14}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em' }}>{tutorProfileData?.bio}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em' }}>{tutorProfileData?.description}</p>
            </div>
            <Button
              style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-15%)' }}
              type="link"
              onClick={() => setSlide('1')}
            >
              <DoubleLeftOutlined />
            </Button>
          </Col>
        )}
      </Row>
      <Row align="middle" justify="space-around">
        <Col span={24}>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab={t('common.reviewsTitle')} key="1">
              <div></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.questions')} key="2">
              <div></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.services')} key="3">
              {tutorServicesQuery?.data?.map((service: any) => (
                <Card key={service.id} style={{ margin: '1em' }}>
                  <Row align="middle" justify="space-between">
                    <Col span={24}>
                      <span>{service.name}</span>
                    </Col>
                    <Col span={24}>
                      <span
                        style={{
                          fontSize: '0.8em',
                          color: 'var(--primary-color)',
                        }}
                      >
                        {t(`common.${service.type}`)}
                      </span>
                    </Col>
                    <Col span={12}>
                      <Rate
                        style={{
                          fontSize: '1.2em',
                          display: 'flex',
                          margin: '0 0.5em 0.5em 0',
                        }}
                        value={service?.avg_score}
                        allowHalf
                        disabled
                      />
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                      <span
                        style={{
                          fontSize: '0.8em',
                          marginRight: '0.5em',
                        }}
                      >
                        {service?.review_count === 1
                          ? t('common.review', {
                              count: service?.review_count,
                            })
                          : t('common.reviews', {
                              count: service?.review_count,
                            })}
                      </span>
                    </Col>
                  </Row>
                  <Row align="middle" justify="start">
                    <Col span={24}>
                      <Paragraph
                        ellipsis={{
                          rows: 4,
                          expandable: true,
                          symbol: t('common.readMore'),
                        }}
                        style={{
                          fontSize: '0.8em',
                        }}
                      >
                        {service?.description}
                      </Paragraph>
                    </Col>
                  </Row>
                  <Row align="middle" justify="space-between">
                    <Col span={12}>
                      <span
                        style={{
                          fontSize: '1.2em',
                        }}
                      >
                        ${service?.price} {service.is_unit_price ? t('common.perUnit') : ''}
                      </span>
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button
                        type="link"
                        onClick={() => setService(service)}
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'rgba(var(--primary-rgb-color), 0.1)',
                        }}
                      >
                        {t('common.book')}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
