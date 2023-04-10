import { AutoComplete } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from 'use-places-autocomplete';

export const PlacesAutocomplete = ({ setSelected, currentPosition, selected }: any) => {
  const { t } = useTranslation();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new window.google.maps.LatLng(currentPosition?.lat, currentPosition?.lng),
      radius: 2000,
      types: ['address'],
    },
    debounce: 300,
  });

  useEffect(() => {
    if (!!selected && !!selected.details && !selected.details.address_components) {
      setValue(
        `${selected?.details?.street}, ${selected?.details?.number}, ${selected?.details?.province}, ${selected?.details?.country}, ${selected?.details?.postcode}`,
      );
    }
  }, [selected]);

  const optionsData = () => {
    if (status === 'OK') {
      return data.map((place) => ({
        value: place.description,
        label: place.description,
      }));
    }
    return [];
  };

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const details = await getDetails({ placeId: results[0].place_id, fields: ['address_components'] });
    const { lat, lng } = getLatLng(results[0]);
    setSelected({ lat, lng, details });
  };

  return (
    <>
      {currentPosition && (
        <AutoComplete
          allowClear
          onClear={() => setSelected({ lat: currentPosition.lat, lng: currentPosition.lng })}
          placeholder={t('common.searchAddress')}
          style={{ margin: '1em', marginTop: '0.5em', width: '100%' }}
          value={value}
          onChange={(e: any) => setValue(e)}
          onSelect={handleSelect}
          disabled={!ready}
          options={optionsData()}
        />
      )}
    </>
  );
};
