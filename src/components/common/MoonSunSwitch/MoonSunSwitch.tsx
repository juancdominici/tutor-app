import React from 'react';
import * as S from './MoonSunSwitch.styles';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { useTranslation } from 'react-i18next';

interface MoonSunSwitchProps {
  withText?: boolean;
  isMoonActive: boolean;
  onClickMoon: () => void;
  onClickSun: () => void;
}

export const MoonSunSwitch: React.FC<MoonSunSwitchProps> = ({
  withText = false,
  isMoonActive,
  onClickMoon,
  onClickSun,
}) => {
  const { t } = useTranslation();
  return (
    <S.ButtonGroup $isFirstActive={isMoonActive}>
      <S.Btn size="small" type="text" icon={<MoonIcon />} onClick={onClickMoon}>
        {withText ? t('common.darkTheme') : ''}
      </S.Btn>
      <S.Btn size="small" type="text" icon={<SunIcon />} onClick={onClickSun}>
        {withText ? t('common.lightTheme') : ''}
      </S.Btn>
    </S.ButtonGroup>
  );
};
