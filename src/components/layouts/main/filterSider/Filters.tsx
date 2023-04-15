import { DoubleLeftOutlined, FrownOutlined, MehOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { SERVICE_TYPE } from '@app/constants/constants';
import { useAppSelector } from '@app/hooks/reduxHooks';
import {
  setPriceFilterMax,
  setPriceFilterMin,
  setReviewFilter,
  setServiceTypeFilter,
} from '@app/store/slices/filtersSlice';
import { Button, Col, Divider, InputNumber, Rate, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const customIcons: Record<number, React.ReactNode> = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

export const Filters = ({ toggleSider }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { priceFilter, serviceTypeFilter, reviewFilter } = useAppSelector((state) => state.filters);

  return (
    <Row justify="center">
      <Col span={18}>
        <Button
          icon={
            <DoubleLeftOutlined
              onClick={toggleSider}
              style={{
                fontSize: '1.5em',
              }}
            />
          }
          style={{
            position: 'absolute',
            top: '5px',
            right: '-20px',
            zIndex: 999,
          }}
          size="large"
          shape="circle"
          type="text"
        />
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-light-color)', margin: '1em', marginTop: '3em', fontSize: '0.9em' }}>
          {t('filter.price')}
        </p>
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputNumber
          type="number"
          style={{ margin: '1em' }}
          addonAfter="$"
          addonBefore={t('common.min')}
          controls
          value={priceFilter[0]}
          onChange={(value) => dispatch(setPriceFilterMin(value))}
        />
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputNumber
          type="number"
          style={{ margin: '1em' }}
          addonAfter="$"
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
          labelInValue={true}
          value={serviceTypeFilter}
          onChange={(value) => dispatch(setServiceTypeFilter(value))}
          options={[
            { value: '', label: t('common.serviceType'), disabled: true },
            ...SERVICE_TYPE.map((type) => ({ value: type, label: t(`common.${type}`) })),
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
          style={{ margin: '0.5em 1em 1em 1em', fontSize: '2em', lineHeight: '0' }}
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
