import React, { useState } from 'react';
import * as S from './MainSider/MainSider.styles';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@app/api/auth.api';
import { Loading } from '@app/components/common/Loading';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const [img, setImg] = useState(() => (theme === 'dark' ? logoDark : logo));
  const [username, setUsername] = useState('Tutor');

  const { isLoading } = useQuery(['user'], getUserData, {
    onSuccess: (data) => {
      if (!!data?.userMetadata?.session?.user.user_metadata.avatar_url) {
        setImg(data?.userMetadata?.session?.user.user_metadata.avatar_url);
      }
      if (!!data?.userMetadata?.session?.user.user_metadata.full_name) {
        setUsername(data?.userMetadata?.session?.user.user_metadata.full_name);
      }
      if (!!data?.userData.name) {
        setUsername(data?.userData.name);
      }
    },
  });

  return (
    <>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <S.SiderLogoDiv>
          <S.SiderLogoLink to="/" style={{ pointerEvents: 'none' }}>
            <img
              src={img}
              alt="Tutor"
              width={48}
              height={48}
              referrerPolicy="no-referrer"
              style={{
                borderRadius: '50%',
                border: '1px solid #fff',
                padding: '2px',
                backgroundColor: '#fff',
                boxShadow: '0 0 0 1px #fff',
                pointerEvents: 'none',
                width: '4em',
                height: '4em',
                margin: '10px',
              }}
            />
            <S.BrandSpan>{username}</S.BrandSpan>
          </S.SiderLogoLink>
        </S.SiderLogoDiv>
      )}
    </>
  );
};
