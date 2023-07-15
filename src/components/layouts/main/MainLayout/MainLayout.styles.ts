import styled from 'styled-components';
import { Layout } from 'antd';
import { media } from '@app/styles/themes/constants';

export const LayoutMaster = styled(Layout)`
  height: 100vh;
  height: 100dvh;
  min-height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const LayoutMain = styled(Layout)`
  @media only screen and ${media.md} {
    margin-left: unset;
  }

  @media only screen and ${media.xl} {
    margin-left: unset;
  }
`;
