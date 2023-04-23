import { getTutorAddressesFiltered as getTutorAddressesFilteredAction } from '@app/api/addresses.api';
import { checkUserExistance as checkUserExistanceAction } from '@app/api/auth.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { setMinCoords, setMaxCoords } from '@app/store/slices/filtersSlice';
import { GoogleMap, OverlayView } from '@react-google-maps/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Col, Popover, Rate, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';

export const HomePage = () => {
  const { t } = useTranslation();
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [addressList, setAddressList] = useState<any>([]);
  const { priceFilter, serviceTypeFilter, reviewFilter, minCoords, maxCoords } = useAppSelector(
    (state) => state.filters,
  );
  const theme = useAppSelector((state) => state.theme.theme);
  const mapRef = useRef<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setOptions = () => {
    return {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      minZoom: 10,
      maxZoom: 18,

      styles:
        theme === 'dark'
          ? [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }],
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }],
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }],
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }],
              },
            ]
          : [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
    };
  };
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

  const { mutate: getAddressList } = useMutation(getTutorAddressesFilteredAction, {
    onSuccess: (data) => {
      setAddressList(data);
    },
  });

  const handleMapBoundsChanged = async () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    if (bounds) {
      const northEast = await bounds?.getNorthEast();
      const southWest = await bounds?.getSouthWest();
      dispatch(setMaxCoords({ lat: northEast.lat(), lng: northEast.lng() }));
      dispatch(setMinCoords({ lat: southWest.lat(), lng: southWest.lng() }));
    }
  };
  const handleCenterChanged = () => {
    if (!mapRef.current) return;
  };

  const handleMapLoad = async (map: any) => {
    mapRef.current = map;
  };

  const handleMapIdle = () => {
    getAddressList({
      minCoords,
      maxCoords,
      priceFilter,
      serviceTypeFilter,
      reviewFilter,
    });
  };

  useEffect(() => {
    if (currentPosition) {
      getAddressList({
        minCoords,
        maxCoords,
        priceFilter,
        serviceTypeFilter,
        reviewFilter,
      });
    }
  }, [currentPosition, priceFilter, serviceTypeFilter, reviewFilter]);

  const openUserProfile = (address: any) => {
    navigate(`/profile/${address.tutor_id}`, {
      state: {
        address,
      },
    });
  };

  const { data: checkUserExistance } = useQuery(['checkUserExistance'], checkUserExistanceAction);

  return (
    <>
      <PageTitle>{t('common.home')}</PageTitle>

      <Row style={{ height: '88vh', width: '100%' }}>
        <Col style={{ height: '100%', width: '100%' }}>
          {currentPosition && checkUserExistance === 'user' && (
            <GoogleMap
              center={currentPosition}
              zoom={15}
              options={setOptions()}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              onLoad={handleMapLoad}
              onIdle={handleMapIdle}
              onBoundsChanged={handleMapBoundsChanged}
              onCenterChanged={handleCenterChanged}
            >
              <OverlayView
                position={{ lat: currentPosition.lat, lng: currentPosition.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="blob green"></div>
              </OverlayView>
              {addressList?.map((address: any) => (
                <OverlayView
                  key={address.address_id}
                  position={{ lat: address.latitude, lng: address.longitude }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Popover
                    content={
                      <div onClick={() => openUserProfile(address)}>
                        <Row align="middle" justify="space-around">
                          <Col span={8}>
                            <img
                              src={`https://source.boringavatars.com/beam/120/${address.tutor_name?.split(' ')[0]}%20${
                                address.tutor_name?.split(' ')[1]
                              }?colors=3ECF8E,1A1E22,008640,F8FBFF`}
                              alt="user-avatar"
                              referrerPolicy="no-referrer"
                              style={{
                                borderRadius: '50%',
                                padding: '2px',
                                boxShadow: '0 0 0 1px #f3f3f333',
                                pointerEvents: 'none',
                                width: '3em',
                                height: '3em',
                              }}
                            />
                          </Col>
                          <Col span={16}>
                            <div>
                              <span
                                style={{
                                  fontSize: '0.7em',
                                }}
                              >
                                {address.tutor_name}
                              </span>
                            </div>
                            <Rate
                              style={{
                                fontSize: '1.2em',
                                display: 'flex',
                                margin: '0 0.5em 0 0',
                              }}
                              value={address.avg_score}
                              disabled
                            />
                            <div>
                              <span
                                style={{
                                  fontSize: '0.7em',
                                }}
                              >
                                {address.review_count === 1
                                  ? t('common.review', {
                                      count: address.review_count,
                                    })
                                  : t('common.reviews', {
                                      count: address.review_count,
                                    })}
                              </span>
                            </div>
                          </Col>
                        </Row>
                        <Row align="middle" justify="space-around">
                          <img
                            src={require('../assets/images/marker.png').default}
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
                              fontSize: '0.7em',
                            }}
                          >
                            {address.street} {address.number} - {address.province}
                          </span>
                        </Row>
                      </div>
                    }
                    trigger="click"
                  >
                    <img
                      src={require('../assets/images/marker.png').default}
                      alt="map-marker"
                      style={{
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  </Popover>
                </OverlayView>
              ))}
            </GoogleMap>
          )}
          {checkUserExistance === 'tutor' && <DashboardPage />}
        </Col>
      </Row>
    </>
  );
};
