import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { checkUserExistance as checkUserExistanceAction } from '@app/api/auth.api';
import { useQuery } from '@tanstack/react-query';
import { notificationController } from '@app/controllers/notificationController';
import { Loading } from '../common/Loading';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const [childrenToRender, setChildrenToRender] = useState(<></>);

  const { data: checkUserExistance } = useQuery(['checkUserExistance'], checkUserExistanceAction, {
    onSuccess: (data: any) => {
      switch (data) {
        case 'user':
          setChildrenToRender(<>{children}</>);
          break;
        case 'tutor':
          setChildrenToRender(<>{children}</>);
          break;
        case 'fresh':
          setChildrenToRender(<Navigate to="/welcome/user-config" replace />);
          break;
        default:
          setChildrenToRender(<Navigate to="/auth/login" replace />);
          break;
      }
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

export default RequireAuth;
