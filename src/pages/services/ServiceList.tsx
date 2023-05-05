import React, { useState } from 'react';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Collapse, Dropdown, Input, Menu, Row, Select, Typography } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserServices as getUserServicesAction, deleteService as deleteServiceAction } from '../../api/services.api';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { notificationController } from '@app/controllers/notificationController';
import { LOCATION_TYPE, SERVICE_TYPE } from '@app/constants/constants';
const { Panel } = Collapse;
const { Paragraph } = Typography;
export const ServiceList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: services, isLoading: isLoadingServices } = useQuery(['services'], getUserServicesAction, {
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteService } = useMutation(deleteServiceAction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      notificationController.success({ message: t('common.serviceDeleted') });
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const filteredServices = () => {
    if (search || typeFilter) {
      return services?.filter(
        (service) =>
          (t(`constants.location.${service.location}`).toLowerCase().includes(search.toLowerCase()) ||
            service.name.toLowerCase().includes(search.toLowerCase())) &&
          (service.type === typeFilter || !typeFilter),
      );
    }
    return services;
  };

  const menu = (service: any) => (
    <Menu>
      <Menu.Item onClick={() => navigate(`/tutor/services/edit/${service.id}`)} icon={<EditOutlined />}>
        {t('common.edit')}
      </Menu.Item>
      <Menu.Item onClick={() => deleteService(service)} danger icon={<DeleteOutlined />}>
        {t('common.delete')}
      </Menu.Item>
    </Menu>
  );

  const genExtra = (service: any) => (
    <Dropdown overlay={menu(service)} placement="bottomRight">
      <SettingOutlined onClick={(event) => event.stopPropagation()} />
    </Dropdown>
  );

  const goBack = () => {
    navigate('/home');
  };

  if (isLoadingServices) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.services')}</PageTitle>
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
          {t('common.services')}
        </h1>
        <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }}>
          <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
      </Row>
      <Row>
        <Input
          placeholder={t('common.searchService')}
          style={{
            margin: '0 1rem',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Row>
      <Row>
        <Select
          placeholder={t('common.filterByType')}
          style={{
            margin: '1rem',
            width: '100%',
          }}
          value={typeFilter}
          onChange={(value: any) => setTypeFilter(value)}
          allowClear
          options={[
            { value: '', label: t('common.filterByType'), disabled: true },
            ...SERVICE_TYPE.map((type) => ({ value: type, label: t(`constants.service_types.${type}`) })),
          ]}
        />
      </Row>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="start"
        style={{ margin: '0.5em', border: 'none', boxShadow: '0px 10px 10px 0px #00000022' }}
      >
        {filteredServices()?.map((service) => (
          <Panel
            style={{
              border: 'none',
            }}
            header={
              <>
                <strong>{t('common.name')}: </strong>
                {service.name}
              </>
            }
            key={service.id}
            extra={genExtra(service)}
          >
            <p style={{ marginLeft: '26px', fontSize: '0.8em', display: 'flex' }}>
              <strong style={{ marginRight: '1em' }}>{t('common.description')}: </strong>
              <Paragraph
                ellipsis={{
                  rows: 4,
                  expandable: true,
                  symbol: t('common.readMore'),
                }}
              >
                {service.description}
              </Paragraph>
            </p>
            <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
              <strong>{t('common.serviceType')}: </strong>
              {t(`constants.service_types.${SERVICE_TYPE.find((type) => type === service.type)}`)}
            </p>
            <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
              <strong>{t('common.location')}: </strong>
              {t(`constants.location.${LOCATION_TYPE.find((location) => location === service.location)}`)}
            </p>
            <p style={{ marginLeft: '26px', fontSize: '0.8em' }}>
              <strong>{t('common.price')}: </strong>${service?.price} {service.is_unit_price ? t('common.perUnit') : ''}
            </p>
          </Panel>
        ))}
      </Collapse>

      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{
          position: 'absolute',
          bottom: '5em',
          right: '1em',
        }}
        onClick={() => navigate('/tutor/services/new')}
      >
        <PlusOutlined style={{ transform: 'scale(1.2)' }} />
      </Button>
    </>
  );
};
