import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const LoginDescription = styled.div`
  margin-bottom: 1.875rem;
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.xs};

  @media only screen and ${media.xs} {
    margin-bottom: 1.5625rem;
    font-weight: ${FONT_WEIGHT.bold};
  }

  @media only screen and ${media.md} {
    margin-bottom: 1.75rem;
    font-weight: ${FONT_WEIGHT.regular};
  }

  @media only screen and ${media.xl} {
    margin-bottom: 1.875rem;
  }
`;

export const RegisterActionText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5em;
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.xs};
  text-decoration: none;
`;

export const ForgotPasswordText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5em;
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.xs};
  text-decoration: none;
`;
