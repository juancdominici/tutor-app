import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { checkUserExistance as checkUserExistanceAction } from '@app/api/auth.api';
import { useQuery } from '@tanstack/react-query';
import { notificationController } from '@app/controllers/notificationController';
import { Loading } from '../common/Loading';

const RequireFreshAccount: React.FC<WithChildrenProps> = ({ children }) => {
  const [childrenToRender, setChildrenToRender] = useState(<></>);
  const location = useLocation();
  const { data: checkUserExistance } = useQuery(['checkUserExistance'], checkUserExistanceAction, {
    onSuccess: (data: any) => {
      if (data === 'fresh' || location.pathname === '/welcome/mp-success') {
        setChildrenToRender(<>{children}</>);
        return;
      }
      setChildrenToRender(<Navigate to="/home" replace />);
    },
    onError: (error: any) => {
      notificationController.error({
        message: error.message,
      });
    },
  });

  if (!checkUserExistance) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return childrenToRender;
};

export default RequireFreshAccount;
