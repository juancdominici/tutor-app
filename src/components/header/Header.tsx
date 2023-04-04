import React from 'react';
import { DesktopHeader } from './layouts/DesktopHeader';
import { MobileHeader } from './layouts/MobileHeader';
import { useResponsive } from '@app/hooks/useResponsive';

interface HeaderProps {
  toggleFilterSider: () => void;
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleFilterSider, toggleSider, isSiderOpened }) => {
  return <MobileHeader toggleFilterSider={toggleFilterSider} toggleSider={toggleSider} isSiderOpened={isSiderOpened} />;
};
