import React from 'react';
import { Col, Row } from 'antd';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import * as S from '../Header.styles';
import { SearchOutlined } from '@ant-design/icons';

interface MobileHeaderProps {
  toggleFilterSider: () => void;
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleFilterSider, toggleSider, isSiderOpened }) => {
  return (
    <Row align="top" justify="space-around">
      <Col>
        <SettingsDropdown />
      </Col>
      <Col>
        <SearchOutlined onClick={toggleFilterSider} className="middle-button" />
      </Col>
      <Col>
        <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
      </Col>
    </Row>
  );
};
