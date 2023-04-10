import { getTutorAddressesFiltered } from '@app/api/addresses.api';
import { changeUserPassword as changeUserPasswordAction } from '@app/api/auth.api';
import supabase from '@app/api/supabase';
import { Loading } from '@app/components/common/Loading';
import Map from '@app/components/common/Map';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { t } = useTranslation();
  const [currentPosition, setCurrentPosition] = useState({});

  const savePosition = (position: any) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({ lat: latitude, lng: longitude });
  };

  const positionError = (error: any) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(savePosition, positionError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });
  }, []);

  const { data: addressList, isLoading: addressListLoading } = useQuery(['addressList'], getTutorAddressesFiltered);

  if (addressListLoading) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.home')}</PageTitle>

      <Row style={{ height: '88vh', width: '100%' }}>
        <Col style={{ height: '100%', width: '100%' }}>
          <Map
            center={currentPosition}
            zoom={15}
            zoomControl={true}
            minZoom={10}
            maxZoom={18}
            addressList={addressList}
          />
        </Col>
      </Row>
    </>
  );
};
