import React, { useState } from 'react';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Collapse, Dropdown, Empty, Input, Menu, Row, Typography } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserAddresses as getUserAddressesAction,
  deleteAddress as deleteAddressAction,
} from '../../api/addresses.api';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { notificationController } from '@app/controllers/notificationController';
import { ShareButton } from '@app/components/common/ShareButton';
import { HttpError } from '@app/constants/errors';
const { Panel } = Collapse;

export const AddressList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery(['addresses'], getUserAddressesAction, {
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteAddress } = useMutation(deleteAddressAction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']);
      notificationController.success({ message: t('common.addressDeleted') });
    },
    onError: (error) => {
      if (error instanceof HttpError && error.status === '409') {
        notificationController.error({
          message: t('error.addressInUse'),
        });
        return;
      }
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const filteredAddresses = () => {
    if (search) {
      return addresses?.filter(
        (address) =>
          address.name.toLowerCase().includes(search.toLowerCase()) ||
          address.phone.toLowerCase().includes(search.toLowerCase()) ||
          address.street.toLowerCase().includes(search.toLowerCase()) ||
          address.number.toString().toLowerCase().includes(search.toLowerCase()) ||
          address.province.toLowerCase().includes(search.toLowerCase()) ||
          address.country.toLowerCase().includes(search.toLowerCase()) ||
          address.postcode.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return addresses;
  };

  const menu = (address: any) => (
    <Menu>
      <Menu.Item onClick={() => navigate(`/addresses/edit/${address.id}`)} icon={<EditOutlined />}>
        {t('common.edit')}
      </Menu.Item>
      <Menu.Item onClick={() => deleteAddress(address.id)} danger icon={<DeleteOutlined />}>
        {t('common.delete')}
      </Menu.Item>
    </Menu>
  );

  const genExtra = (address: any) => (
    <Dropdown overlay={menu(address)} placement="bottomRight" trigger={['click']}>
      <SettingOutlined onClick={(event) => event.stopPropagation()} />
    </Dropdown>
  );

  const goBack = () => {
    navigate('/home');
  };

  const filterExport = (addresses: any) => {
    return addresses?.map((address: any) => {
      return {
        name: address.name,
        phone: address.phone,
        address: `${address?.street ?? ''} ${address?.number ?? ''} - ${address?.province ?? ''}, ${
          address?.country ?? ''
        } - CP${address?.postcode ?? ''}`,
      };
    });
  };

  if (isLoadingAddresses) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.addresses')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
        <h1
          style={{
            fontWeight: 500,
            padding: '0 1rem',
            margin: '0',
            color: 'var(--primary-color)',
          }}
        >
          {t('common.addresses')}
        </h1>
        <ShareButton list={filterExport(filteredAddresses())} fileName="addresses" />
      </Row>
      <Row>
        <Input
          placeholder={t('common.searchAddress')}
          style={{
            margin: '1rem',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Row>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="start"
        style={{
          margin: '0.5em',
          border: 'none',
          boxShadow: '0px 10px 10px 0px #00000022',
          backgroundColor: 'var(--sider-background-color)',
        }}
      >
        {filteredAddresses()?.map((address) => (
          <Panel
            style={{
              border: 'none',
            }}
            header={
              <>
                <strong>{t('common.name')}: </strong>
                {address.name}
              </>
            }
            key={address.id}
            extra={genExtra(address)}
          >
            <p style={{ marginLeft: '26px' }}>
              <strong>{t('common.phone')}: </strong>
              {address.phone}
            </p>
            <p style={{ marginLeft: '26px' }}>
              <strong>{t('common.address')}: </strong>
              {`${address?.street ?? ''} ${address?.number ?? ''} - ${address?.province ?? ''}, ${
                address?.country ?? ''
              } - CP${address?.postcode ?? ''}`}
            </p>
          </Panel>
        ))}
      </Collapse>
      {filteredAddresses()?.length === 0 && (
        <Empty
          description={
            <span
              style={{
                fontSize: '0.8em',
                color: 'var(--secondary-color)',
              }}
            >
              {t('common.noElementsOnList')}
            </span>
          }
          style={{
            marginTop: '2em',
          }}
        />
      )}
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{
          position: 'absolute',
          bottom: '5em',
          right: '1em',
        }}
        onClick={() => navigate('/addresses/new')}
      >
        <PlusOutlined style={{ transform: 'scale(1.2)' }} />
      </Button>
    </>
  );
};
