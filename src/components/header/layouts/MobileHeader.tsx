import React from 'react';
import { Col, Row } from 'antd';
import * as S from '../Header.styles';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  toggleNotificationSider: () => void;
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleNotificationSider, toggleSider, isSiderOpened }) => {
  const navigate = useNavigate();

  return (
    <Row align="top" justify="space-around">
      <Col>
        <S.MobileBell onClick={toggleNotificationSider} />
      </Col>
      <Col>
        <HomeOutlined onClick={() => navigate('/home')} className="middle-button" />
      </Col>
      <Col>
        <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
      </Col>
    </Row>
  );
};
