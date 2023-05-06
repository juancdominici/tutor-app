import React from 'react';
import Overlay from '../../../common/Overlay';
import { useResponsive } from 'hooks/useResponsive';
import * as S from './FilterSider.styles';
import { Filters } from './Filters';

interface MainSiderProps {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const FilterSider: React.FC<MainSiderProps> = ({ isCollapsed, setCollapsed, ...props }) => {
  const toggleSider = () => setCollapsed(!isCollapsed);
  const { isDesktop } = useResponsive();

  return (
    <>
      <S.Sider
        trigger={null}
        collapsed={isCollapsed}
        collapsedWidth={0}
        collapsible={true}
        width={isDesktop ? '30%' : '100%'}
        {...props}
      >
        <S.SiderContent>
          <Filters />
        </S.SiderContent>
      </S.Sider>
      <Overlay onClick={toggleSider} show={!isCollapsed} />
    </>
  );
};

export default FilterSider;
