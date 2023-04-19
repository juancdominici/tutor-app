import { LAYOUT } from '@app/styles/themes/constants';
import { media } from '@app/styles/themes/constants';
import { Layout } from 'antd';
import styled, { css } from 'styled-components';

export const Header = styled(Layout.Header)`
  line-height: 1.5;
  height: 12vh;

  @media only screen and ${media.md} {
    padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  }
`;
