import React from 'react';
import GoogleMap from 'google-map-react';
import { MapMarker } from './MapMarker';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface MapPropsI {
  center: any;
  zoom: number;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  style?: React.CSSProperties;
  addressList?: Array<any> | null;
}
const Map = ({ center, zoom, zoomControl, minZoom, maxZoom, addressList }: MapPropsI) => {
  const urlKey: any = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const theme = useAppSelector((state) => state.theme.theme);

  const setOptions = () => {
    return {
      zoomControl: zoomControl,
      minZoom: minZoom,
      maxZoom: maxZoom,
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
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }],
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }],
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
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }],
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
          : [],
    };
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMap
        center={center}
        defaultZoom={zoom}
        options={setOptions()}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: urlKey }}
      >
        <MapMarker lat={center.lat} lng={center.lng}>
          <div className="blob green"></div>
        </MapMarker>
        {addressList?.map((address: any) => (
          <MapMarker key={address.id} lat={address.lat} lng={address.lng}>
            <img src="/images/map-marker.svg" alt="map-marker" />
          </MapMarker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
