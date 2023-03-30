import React from 'react';
import GoogleMap from 'google-map-react';
import { MapMarker } from './MapMarker';

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
  // const urlKey: any = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const urlKey: any = 'AIzaSyBXPXZwiMlTRso6hruXq-Z6UkV9Dmw93lY';

  return (
    <div style={{ height: '100vh', width: '100%', position: 'absolute' }}>
      <GoogleMap
        center={center}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: urlKey }}
      >
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
