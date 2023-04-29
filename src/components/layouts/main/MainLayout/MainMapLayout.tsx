import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainMapContent from '../MainMapContent/MainMapContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import FilterSider from '../filterSider/FilterSider';

const MainMapLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const [filterSiderCollapsed, setFilterSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);
  const toggleFilterSider = () => {
    // if not on map page, navigate home
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        setFilterSiderCollapsed(!siderCollapsed);
      }, 1000);
    } else {
      setFilterSiderCollapsed(!siderCollapsed);
    }
  };

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

        <MainHeader>
          <Header toggleFilterSider={toggleFilterSider} toggleSider={toggleSider} isSiderOpened={false} />
        </MainHeader>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainMapLayout;
