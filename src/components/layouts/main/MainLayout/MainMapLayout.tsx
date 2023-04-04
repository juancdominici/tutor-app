import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainMapContent from '../MainMapContent/MainMapContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import FilterSider from '../filterSider/FilterSider';

const MainMapLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const [filterSiderCollapsed, setFilterSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);
  const toggleFilterSider = () => setFilterSiderCollapsed(!siderCollapsed);

  useEffect(() => {
    setIsTwoColumnsLayout(isDesktop);
  }, [isDesktop]);

  return (
    <S.LayoutMaster>
      <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
      <FilterSider isCollapsed={filterSiderCollapsed} setCollapsed={setFilterSiderCollapsed} />
      <S.LayoutMain>
        <MainMapContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
          <div>
            <Outlet />
          </div>
        </MainMapContent>
        <div
          style={{
            height: '12vh',
          }}
        >
          <MainHeader>
            <Header toggleFilterSider={toggleFilterSider} toggleSider={toggleSider} isSiderOpened={false} />
          </MainHeader>
        </div>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainMapLayout;
