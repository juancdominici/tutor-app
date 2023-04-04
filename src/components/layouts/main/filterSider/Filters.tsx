import { DoubleLeftOutlined, FrownOutlined, MehOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { SERVICE_TYPE } from '@app/constants/constants';
import { Button, Col, Divider, InputNumber, Rate, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const customIcons: Record<number, React.ReactNode> = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

export const Filters = ({ toggleSider }: any) => {
  const { t } = useTranslation();
  const [serviceType, setServiceType] = useState('');

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
        <p style={{ color: '#000', margin: '1em', marginTop: '3em', fontSize: '0.9em' }}>{t('filter.price')}</p>
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputNumber type="number" style={{ margin: '1em' }} addonAfter="$" addonBefore={t('common.min')} controls />
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputNumber type="number" style={{ margin: '1em' }} addonAfter="$" addonBefore={t('common.max')} controls />
      </Col>
      <Divider />
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Select
          style={{ width: '60vw' }}
          labelInValue={true}
          value={serviceType}
          onChange={(value) => setServiceType(value)}
          options={[
            { value: '', label: t('common.serviceType'), disabled: true },
            ...SERVICE_TYPE.map((type) => ({ value: type, label: t(`common.${type}`) })),
          ]}
        />
      </Col>
      <Divider />
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#000', margin: '1em', fontSize: '0.9em' }}>{t('filter.reviewsBiggerThan')}</p>
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Rate style={{ margin: '0.5em 1em 1em 1em', fontSize: '2em', lineHeight: '0' }} />
      </Col>
      <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button type="primary" icon={<SearchOutlined />}>
          {t('filter.search')}
        </Button>
      </Col>
    </Row>
  );
};
