import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { checkUserExistance as checkUserExistanceAction } from '@app/api/auth.api';
import { useQuery } from '@tanstack/react-query';
import { notificationController } from '@app/controllers/notificationController';
import { Loading } from '../common/Loading';
import { useTranslation } from 'react-i18next';

const RequireAdminRole: React.FC<WithChildrenProps> = ({ children }) => {
  const [childrenToRender, setChildrenToRender] = useState(<></>);
  const { t } = useTranslation();
  const { data: userType } = useQuery(['userType'], checkUserExistanceAction, {
    onSuccess: (data: any) => {
      if (data === 'admin') {
        setChildrenToRender(<>{children}</>);
        return;
      }
      setChildrenToRender(<Navigate to="/home" replace />);
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
    refetchOnWindowFocus: false,
  });

  if (!userType) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return childrenToRender;
};

export default RequireAdminRole;
