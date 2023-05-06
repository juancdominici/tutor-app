import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const SettingsDropdown: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Menu.Item key={'settings'} title="" icon={<SettingOutlined />}>
      <Dropdown overlay={<></>} trigger={['click']}>
        <Link to={'#'}>{t('common.settings')}</Link>
      </Dropdown>
    </Menu.Item>
  );
};
