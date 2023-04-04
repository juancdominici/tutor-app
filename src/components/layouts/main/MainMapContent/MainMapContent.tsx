import styled, { css } from 'styled-components';
import { Layout } from 'antd';
import { media } from '@app/styles/themes/constants';

const { Content } = Layout;

interface HeaderProps {
  $isTwoColumnsLayout: boolean;
}

export default styled(Content)<HeaderProps>`
  padding: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and ${media.md} {
    padding: 0;
  }

  @media only screen and ${media.xl} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        padding: 0;
      `}
  }
`;
