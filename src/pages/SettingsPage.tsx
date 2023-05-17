import React from 'react';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/LanguagePicker/LanguagePicker';
import { NightModeSettings } from '@app/components/header/components/settingsDropdown/settingsOverlay/nightModeSettings/NightModeSettings';
import { ThemePicker } from '@app/components/header/components/settingsDropdown/settingsOverlay/ThemePicker/ThemePicker';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from '@app/components/header/components/settingsDropdown/settingsOverlay/SettingsOverlay/SettingsOverlay.styles';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPWASupported, event } = useAppSelector((state) => state.pwa);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageTitle>{t('common.settings')}</PageTitle>
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
          {t('common.settings')}
        </h1>
      </Row>
      <DropdownCollapse bordered={false} ghost defaultActiveKey={['languagePicker', 'themePicker', 'nightMode']}>
        <DropdownCollapse.Panel header={t('header.changeLanguage')} showArrow={false} disabled key="languagePicker">
          <LanguagePicker />
        </DropdownCollapse.Panel>
        <DropdownCollapse.Panel header={t('header.changeTheme')} showArrow={false} disabled key="themePicker">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemePicker withText={true} />
          </div>
        </DropdownCollapse.Panel>
        <DropdownCollapse.Panel header={t('header.nightMode.title')} showArrow={false} disabled key="nightMode">
          <NightModeSettings />
        </DropdownCollapse.Panel>
      </DropdownCollapse>
      {isPWASupported && (
        <S.PwaInstallWrapper>
          <Button block type="primary" onClick={() => event && (event as BeforeInstallPromptEvent).prompt()}>
            {t('common.pwa')}
          </Button>
        </S.PwaInstallWrapper>
      )}
    </>
  );
};
