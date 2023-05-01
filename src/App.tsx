import React from 'react';
import { ConfigProvider } from 'antd';
import ptPT from 'antd/lib/locale/de_DE';
import esES from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useLoadScript } from '@react-google-maps/api';
import { Loading } from './components/common/Loading';
const queryClient = new QueryClient();

const App: React.FC = () => {
  const { language } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);
  const librariesArr: any = ['places'];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: librariesArr,
  });

  usePWA();

  useAutoNightMode();

  useThemeWatcher();

  if (!isLoaded) return <Loading />;

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={language === 'es' ? esES : ptPT}>
          <AppRouter />
        </ConfigProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default App;
