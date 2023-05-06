import React from 'react';
import { MobileHeader } from './layouts/MobileHeader';

interface HeaderProps {
  toggleNotificationSider: () => void;
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleNotificationSider, toggleSider, isSiderOpened }) => {
  return (
    <MobileHeader
      toggleNotificationSider={toggleNotificationSider}
      toggleSider={toggleSider}
      isSiderOpened={isSiderOpened}
    />
  );
};
