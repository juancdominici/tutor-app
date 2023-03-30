import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { checkUserExistance } from '@app/api/auth.api';

const RequireTutorRole: React.FC<WithChildrenProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    handleCheck();
  }, []);

  const handleCheck = async () => {
    const response = await checkUserExistance();
    if (response === 'tutor') {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  return authenticated ? <>{children}</> : <Navigate to="/home" replace />;
};

export default RequireTutorRole;