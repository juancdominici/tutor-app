import { ArrowLeftOutlined, DoubleLeftOutlined, DoubleRightOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getTutorAddresses } from '@app/api/addresses.api';
import { getTutorProfileData } from '@app/api/auth.api';
import { getTutorQuestions, getTutorReviews, getTutorServices } from '@app/api/profiles.api';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Button, Col, Rate, Row, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
              <Select
                style={{ width: '90%', margin: '1em 0' }}
                size="small"
                options={tutorAddressesQuery?.data?.map((address) => ({
                  value: address.id,
                  label: `${address.street} ${address.number}, ${address.province} - ${address.country}, ${address.postcode}`,
                }))}
                onChange={(value) => console.log(value)}
              />
            </Col>
          </>
        ) : (
          <Col span={14}>
            <Button
              style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-55%)' }}
              type="link"
              onClick={() => setSlide('1')}
            >
              <DoubleLeftOutlined />
            </Button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em', fontWeight: 'bold' }}>{t('common.bio')}:</p>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em' }}>{tutorProfileData?.bio}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em', fontWeight: 'bold' }}>{t('common.description')}:</p>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em' }}>{tutorProfileData?.description}</p>
            </div>
          </Col>
        )}
        <Col span={24}>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab={t('common.reviewsTitle')} key="1">
              <div></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.reviewsTitle')} key="2">
              <div></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.services')} key="3">
              <div></div>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
