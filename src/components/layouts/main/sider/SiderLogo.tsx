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
  const [username, setUsername] = useState('Tutor');

  const { data: userData, isLoading } = useQuery(['user'], getUserData, {
    onSuccess: (data) => {
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
          <S.SiderLogoLink to={`/profile/${userData?.userData?.id}`}>
            <img
              src={`https://source.boringavatars.com/beam/120/${username?.split(' ')[0]}%20${
                username?.split(' ')[1]
              }?colors=3ECF8E,1A1E22,008640,F8FBFF`}
              alt="user-avatar"
              referrerPolicy="no-referrer"
              style={{
                borderRadius: '50%',
                padding: '2px',
                boxShadow: '0 0 0 1px #f3f3f333',
                width: '3em',
                height: '3em',
              }}
            />
            <S.BrandSpan>{username}</S.BrandSpan>
          </S.SiderLogoLink>
        </S.SiderLogoDiv>
      )}
    </>
  );
};
