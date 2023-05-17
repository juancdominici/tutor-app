import React, { useState } from 'react';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Collapse, Dropdown, Input, Menu, Row } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers as getUsersAction, deleteUser as deleteUserAction } from '../../api/users.api';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { notificationController } from '@app/controllers/notificationController';
import moment from 'moment';
import { ShareButton } from '@app/components/common/ShareButton';
const { Panel } = Collapse;

export const UserList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery(['users'], getUsersAction, {
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteUser } = useMutation(deleteUserAction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      notificationController.success({ message: t('common.userDeleted') });
    },
    onError: () => {
      notificationController.error({
        message: t('error.somethingHappened'),
      });
    },
  });

  const filteredUsers = () => {
    if (search) {
      return users?.users?.filter((user: any) => user.email.toLowerCase().includes(search.toLowerCase()));
    }
    return users?.users;
  };

  const menu = (user: any) => (
    <Menu>
      <Menu.Item onClick={() => navigate(`/admin/users/edit/${user.id}`)} icon={<EditOutlined />}>
        {t('common.edit')}
      </Menu.Item>
      <Menu.Item onClick={() => deleteUser(user.id)} danger icon={<DeleteOutlined />}>
        {t('common.delete')}
      </Menu.Item>
    </Menu>
  );

  const genExtra = (user: any) => (
    <Dropdown overlay={menu(user)} placement="bottomRight">
      <SettingOutlined onClick={(event) => event.stopPropagation()} />
    </Dropdown>
  );

  const goBack = () => {
    navigate('/home');
  };

  const computedDate = (date: any) => {
    if (!date) {
      return t('common.never');
    }
    const dateObj = new Date(date);
    return moment(dateObj).format('DD/MM/YYYY - HH:mm') + 'hs';
  };

  const filterExport = (list: any) => {
    return list?.map((user: any) => {
      return {
        email: user.email,
        created_at: computedDate(user.created_at),
        last_sign_in_at: computedDate(user.last_sign_in_at),
        provider: user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1),
      };
    });
  };

  if (isLoadingUsers) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>{t('common.users')}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
        <h1
          style={{
            fontWeight: 500,
            padding: '0 1rem',
            margin: '0',
            color: 'var(--primary-color)',
          }}
        >
          {t('common.users')}
        </h1>
        <ShareButton list={filterExport(filteredUsers())} fileName="users" />
      </Row>
      <Row>
        <Input
          placeholder={t('common.searchUser')}
          style={{
            margin: '1rem',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Row>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="start"
        style={{
          margin: '0.5em',
          border: 'none',
          boxShadow: '0px 10px 10px 0px #00000022',
          backgroundColor: 'var(--sider-background-color)',
        }}
      >
        {filteredUsers()?.map((user: any) => (
          <Panel
            style={{
              border: 'none',
            }}
            header={
              <>
                <strong>{t('login.email')}: </strong>
                {user.email}
              </>
            }
            key={user.id}
            extra={genExtra(user)}
          >
            <p style={{ marginLeft: '26px' }}>
              <strong>{t('common.last_sign_in_at')}: </strong>
              {computedDate(user.last_sign_in_at)}
            </p>
            <p style={{ marginLeft: '26px' }}>
              <strong>{t('common.provider')}: </strong>
              {user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1)}
            </p>
          </Panel>
        ))}
      </Collapse>

      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{
          position: 'absolute',
          bottom: '5em',
          right: '1em',
        }}
        onClick={() => navigate('/admin/users/new')}
      >
        <PlusOutlined style={{ transform: 'scale(1.2)' }} />
      </Button>
    </>
  );
};
