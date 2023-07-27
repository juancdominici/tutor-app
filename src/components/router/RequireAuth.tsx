import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { Loading } from '../common/Loading';
import {
  checkUserExistance as checkUserExistanceAction,
  checkMPTokenValidity as checkMPTokenValidityAction,
} from '@app/api/auth.api';
import supabase from '@app/api/supabase';
import { ChangePasswordModal } from '../common/ChangePasswordModal';
import { useQuery } from '@tanstack/react-query';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const [passwordRecoveryModal, togglePasswordRecoveryModal] = useState(false);
  const navigate = useNavigate();

  // get query params from url
  const params = new URLSearchParams(window.location.search);
  const recover = params.get('recover');

  useEffect(() => {
    if (recover) {
      togglePasswordRecoveryModal(true);
      return;
    }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        togglePasswordRecoveryModal(true);
      }
    });
  }, []);

  const { data: userType, isLoading } = useQuery(['userType'], checkUserExistanceAction, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data === 'none') {
        navigate('/auth/login', { replace: true });
      } else if (data === 'fresh') {
        navigate('/welcome/user-config', { replace: true });
      }
    },
  });
  const { isLoading: isLoadingCheckMPToken } = useQuery(['checkMPTokenValidity'], checkMPTokenValidityAction, {
    refetchOnWindowFocus: false,
    enabled: userType === 'tutor',
    onSuccess: (data) => {
      if (!data) {
        navigate('/welcome/tutor-config', { replace: true });
      }
    },
  });

  if (isLoading ?? isLoadingCheckMPToken) return <Loading />;

  if (passwordRecoveryModal)
    return (
      <ChangePasswordModal
        passwordRecoveryModal={passwordRecoveryModal}
        togglePasswordRecoveryModal={togglePasswordRecoveryModal}
      />
    );

  return <>{children}</>;
};

export default RequireAuth;
