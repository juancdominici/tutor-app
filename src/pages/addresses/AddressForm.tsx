import { ArrowLeftOutlined } from '@ant-design/icons';
import Map from '@app/components/common/Map';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PlacesAutocomplete } from '@app/components/common/PlacesAutocomplete';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAddress as getAddressAction,
  postAddress as postAddressAction,
  putAddress as putAddressAction,
} from '@app/api/addresses.api';
import { Loading } from '@app/components/common/Loading';
import { checkUserExistance } from '@app/api/auth.api';

export const AddressForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPosition, setCurrentPosition] = useState<any>();
  const [mapCenter, setMapCenter] = useState<any>();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const savePosition = (position: any) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({ lat: latitude, lng: longitude });
    setMapCenter({ lat: latitude, lng: longitude });
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

  const { data: userType } = useQuery(['userType'], checkUserExistance, {
    refetchOnWindowFocus: false,
  });

  const { data: addressData, isFetching: addressLoading } = useQuery(
    ['address', id],
    async () => getAddressAction(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (id && !addressLoading) {
      form.setFieldsValue({
        name: addressData[0]?.name,
        phone: addressData[0]?.phone,
      });
      setCurrentPosition({ lat: addressData[0]?.lat, lng: addressData[0]?.lng });

      setMapCenter({
        lat: addressData[0]?.lat,
        lng: addressData[0]?.lng,
        details: {
          street: addressData[0]?.street,
          number: addressData[0]?.number,
          province: addressData[0]?.province,
          country: addressData[0]?.country,
          postcode: addressData[0]?.postcode,
        },
      });
    }
  }, [addressData, addressLoading, form, id]);
  const { mutate: postAddress, isLoading: postAddressLoading } = useMutation(postAddressAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.addressAdded') });
      queryClient.invalidateQueries(['addresses']);
      navigate(-1);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });
  const { mutate: putAddress, isLoading: putAddressLoading } = useMutation(putAddressAction, {
    onSuccess: () => {
      notificationController.success({ message: t('common.addressUpdated') });
      queryClient.invalidateQueries(['addresses']);
      navigate(-1);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const goBack = () => {
    navigate(-1);
  };

  const getStreet = (addressComponents: any) => {
    const street = addressComponents.find((component: any) => component.types.includes('route'));
    return street?.long_name;
  };

  const getNumber = (addressComponents: any) => {
    const number = addressComponents.find((component: any) => component.types.includes('street_number'));
    return number?.long_name;
  };

  const getProvince = (addressComponents: any) => {
    const city = addressComponents.find((component: any) => component.types.includes('administrative_area_level_1'));
    return city?.long_name;
  };

  const getPostalCode = (addressComponents: any) => {
    const postalCode = addressComponents.find((component: any) => component.types.includes('postal_code'));
    return postalCode?.long_name;
  };

  const getCountry = (addressComponents: any) => {
    const country = addressComponents.find((component: any) => component.types.includes('country'));
    return country?.long_name;
  };

  const handleSubmit = async (values: any) => {
    const isValidForm = await form.validateFields();
    if (!!mapCenter?.details && isValidForm) {
      const address = {
        name: values.name,
        phone: values.phone,
        location: `POINT(${mapCenter.lat} ${mapCenter.lng})`,
        street: mapCenter.details.address_components
          ? getStreet(mapCenter.details.address_components)
          : mapCenter.details.street,
        number: mapCenter.details.address_components
          ? getNumber(mapCenter.details.address_components)
          : mapCenter.details.number,
        country: mapCenter.details.address_components
          ? getCountry(mapCenter.details.address_components)
          : mapCenter.details.country,
        province: mapCenter.details.address_components
          ? getProvince(mapCenter.details.address_components)
          : mapCenter.details.province,
        postcode: mapCenter.details.address_components
          ? getPostalCode(mapCenter.details.address_components)
          : mapCenter.details.postcode,
        status: true,
      };

      if (id) {
        putAddress({ id, ...address });
      } else {
        postAddress(address);
      }
    }
  };

  if (addressLoading || postAddressLoading || putAddressLoading) return <Loading />;

  return (
    <>
      <PageTitle>{id ? t('common.editingAddress') : t('common.addingAddress')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" size="large" onClick={goBack}>
          <ArrowLeftOutlined />
        </Button>
        <h1
          style={{
            fontWeight: 500,
            padding: '0 1rem',
            margin: '0',
            color: 'var(--primary-color)',
          }}
        >
          {id ? t('common.editingAddress') : t('common.addingAddress')}
        </h1>
      </Row>
      <BaseForm layout="vertical" onFinish={handleSubmit} form={form}>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="name"
            extra={
              userType === 'tutor' && (
                <p style={{ color: 'var(--subtext-color)', fontSize: '0.8em', margin: '0.5em' }}>
                  {t('common.addressNameExtra')}
                </p>
              )
            }
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('common.name')} />
          </FormItem>
        </Row>
        <Row align="middle">
          <FormItem
            style={{ margin: '0.5em 1em', width: '100%' }}
            name="phone"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('common.phone')} />
          </FormItem>
        </Row>
        <Row align="middle">
          <PlacesAutocomplete
            setSelected={setMapCenter}
            currentPosition={currentPosition}
            selected={id ? { ...mapCenter } : null}
          />
        </Row>
        <Row align="middle" style={{ height: '30vh', width: '100%' }}>
          <Map center={mapCenter} zoom={15} draggable={false} />
        </Row>
        <Row align="middle" justify="center">
          <Button
            type="primary"
            htmlType="submit"
            style={{ margin: '1em', width: '100%' }}
            disabled={!mapCenter?.details}
          >
            {t('common.save')}
          </Button>
        </Row>
      </BaseForm>
    </>
  );
};
