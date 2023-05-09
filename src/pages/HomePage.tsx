import { getTutorAddressesFiltered as getTutorAddressesFilteredAction } from '@app/api/addresses.api';
import { checkUserExistance as checkUserExistanceAction } from '@app/api/auth.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { setMinCoords, setMaxCoords } from '@app/store/slices/filtersSlice';
import { GoogleMap, OverlayView } from '@react-google-maps/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Popover, Rate, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { ReactComponent as leavesSvg } from '../assets/images/leaves.svg';
import Icon from '@ant-design/icons';

export const HomePage = () => {
  const { t } = useTranslation();
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [addressList, setAddressList] = useState<any>([]);
  const [isOffcenter, setIsOffcenter] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const { priceFilter, serviceTypeFilter, reviewFilter, minCoords, maxCoords } = useAppSelector(
    (state) => state.filters,
  );
  const theme = useAppSelector((state) => state.theme.theme);
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
      setIsOffcenter(false);
    },
  });

  const resetBounds = async (bounds: any) => {
    if (bounds) {
      const northEast = await bounds?.getNorthEast();
      const southWest = await bounds?.getSouthWest();
      dispatch(setMaxCoords({ lat: northEast.lat(), lng: northEast.lng() }));
      dispatch(setMinCoords({ lat: southWest.lat(), lng: southWest.lng() }));
    }
  };

  const handleMapBoundsChanged = async () => {
    if (!mapData) return;
    const bounds = mapData.getBounds();
    await resetBounds(bounds);
  };
  const handleCenterChanged = () => {
    if (!mapData) return;
    const center = mapData.getCenter();
    if (center !== currentPosition) {
      setIsOffcenter(true);
    }
  };

  const handleMapLoad = async (map: any) => {
    setMapData(map);
  };

  const minCoordsForCurrentPosition = () => {
    if (!currentPosition) return;
    const minLat = currentPosition.lat - 0.01;
    const minLng = currentPosition.lng - 0.01;
    return { lat: minLat, lng: minLng };
  };

  const maxCoordsForCurrentPosition = () => {
    if (!currentPosition) return;
    const maxLat = currentPosition.lat + 0.01;
    const maxLng = currentPosition.lng + 0.01;
    return { lat: maxLat, lng: maxLng };
  };

  const getMapData = async () => {
    if (!mapData) return;

    const bounds = mapData.getBounds();
    await resetBounds(bounds);
    getAddressList({
      minCoords: minCoords || minCoordsForCurrentPosition(),
      maxCoords: maxCoords || maxCoordsForCurrentPosition(),
      priceFilter,
      serviceTypeFilter,
      reviewFilter,
    });
  };

  useEffect(() => {
    if (currentPosition && mapData) {
      getMapData();
    }
  }, [currentPosition, mapData]);

  useEffect(() => {
    // Check for changes in filters
    if (minCoords && maxCoords && mapData) {
      getAddressList({
        minCoords: minCoords || minCoordsForCurrentPosition(),
        maxCoords: maxCoords || maxCoordsForCurrentPosition(),
        priceFilter,
        serviceTypeFilter,
        reviewFilter,
      });
    }
  }, [priceFilter, serviceTypeFilter, reviewFilter]);

  const openUserProfile = (address: any) => {
    navigate(`/profile/${address.tutor_id}`, {
      state: {
        address,
      },
    });
  };

  const { data: checkUserExistance } = useQuery(['checkUserExistance'], checkUserExistanceAction, {
    refetchOnWindowFocus: false,
  });

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
                              character={<Icon component={leavesSvg} />}
                              style={{
                                color: 'var(--primary-color)',
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
                        {/* <Row align="middle" justify="space-around">
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
                        </Row> */}
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
          <Button
            type="primary"
            style={{
              position: 'absolute',
              bottom: '1em',
              right: '50%',
              transform: 'translateX(50%)',
              zIndex: 1000,
              borderRadius: '50px',
              height: '3em',
              display: isOffcenter ? 'block' : 'none',
            }}
            onClick={() => getMapData()}
          >
            {t('common.searchInThisArea')}
          </Button>

          {checkUserExistance === 'tutor' && <DashboardPage />}
        </Col>
      </Row>
    </>
  );
};
