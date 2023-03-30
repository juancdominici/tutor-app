import { getTutorAddressesFiltered } from '@app/api/adresses.api';
import { Loading } from '@app/components/common/Loading';
import Map from '@app/components/common/Map';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

export const HomePage = () => {
  // get current location from the browser
  // get the list of tutors from the backend
  // pass the list of tutors to the map component
  // pass the current location to the map component
  const [currentPosition, setCurrentPosition] = useState({});

  const savePosition = (position: any) => {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);
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
      <Map center={currentPosition} zoom={12} zoomControl={true} minZoom={10} maxZoom={15} addressList={addressList} />
    </>
  );
};
