import Icon from '@ant-design/icons';
import { SERVICE_TYPE } from '@app/constants/constants';
import { useAppSelector } from '@app/hooks/reduxHooks';
import {
  setPriceFilterMax,
  setPriceFilterMin,
  setReviewFilter,
  setServiceTypeFilter,
} from '@app/store/slices/filtersSlice';
import { Col, Divider, InputNumber, Rate, Row, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ReactComponent as leavesSvg } from '../../../../assets/images/leaves.svg';

export const Filters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { priceFilter, serviceTypeFilter, reviewFilter } = useAppSelector((state) => state.filters);

  return (
    <Row justify="center">
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-light-color)', margin: '1em', marginTop: '3em', fontSize: '0.9em' }}>
          {t('filter.price')}
        </p>
      </Col>
      <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputNumber
          type="number"
          style={{ margin: '1em' }}
          addonBefore={t('common.min')}
          controls
          value={priceFilter[0]}
          onChange={(value) => dispatch(setPriceFilterMin(value))}
        />
        <InputNumber
          type="number"
          style={{ margin: '1em' }}
          addonBefore={t('common.max')}
          controls
          value={priceFilter[1]}
          onChange={(value) => dispatch(setPriceFilterMax(value))}
        />
      </Col>
      <Divider />
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Select
          style={{ width: '60vw' }}
          value={serviceTypeFilter}
          onSelect={(value: string) => dispatch(setServiceTypeFilter(value))}
          allowClear
          onClear={() => dispatch(setServiceTypeFilter(''))}
          options={[
            { value: '', label: t('common.serviceType'), disabled: true },
            ...SERVICE_TYPE.map((type) => ({ value: type, label: t(`constants.service_types.${type}`) })),
          ]}
        />
      </Col>
      <Divider />
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-light-color)', margin: '1em', fontSize: '0.9em' }}>
          {t('filter.reviewsBiggerThan')}
        </p>
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Rate
          character={<Icon component={leavesSvg} />}
          style={{ margin: '0.5em 1em 1em 1em', fontSize: '2em', lineHeight: '0', color: 'var(--primary-color)' }}
          value={reviewFilter}
          onChange={(value) => dispatch(setReviewFilter(value))}
        />
      </Col>
      {/* <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          {t('filter.search')}
        </Button>
      </Col> */}
    </Row>
  );
};
