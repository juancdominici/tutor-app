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
  addressList?: Array<any>;
}
const Map = ({ center, zoom, zoomControl, minZoom, maxZoom, style, addressList }: MapPropsI) => {
  const urlKey: any = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <GoogleMap
      defaultCenter={center}
      defaultZoom={zoom}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={{ key: urlKey }}
    >
      {addressList?.map((address: any) => (
        <MapMarker key={address.id} lat={address.lat} lng={address.lng} style={{}}>
          <img src="/images/map-marker.svg" alt="map-marker" />
        </MapMarker>
      ))}
    </GoogleMap>
  );
};

export default Map;
