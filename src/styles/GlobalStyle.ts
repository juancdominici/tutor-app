import { createGlobalStyle } from 'styled-components';
import { resetCss } from './resetCss';
import { BREAKPOINTS, FONT_SIZE, FONT_WEIGHT, media } from './themes/constants';
import {
  lightThemeVariables,
  darkThemeVariables,
  commonThemeVariables,
  antOverrideCssVariables,
} from './themes/themeVariables';

export default createGlobalStyle`

  ${resetCss}

  [data-theme='light'],
  :root {
    ${lightThemeVariables}
  }

  [data-theme='dark'] {
    ${darkThemeVariables}
  }

  :root {
    ${commonThemeVariables};
    ${antOverrideCssVariables};
  } 

  [data-no-transition] * {
    transition: none !important;
  }
  
  .range-picker {
    & .ant-picker-panels {
      @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px) {
        display: flex;
      flex-direction: column;
      }
    }
  }

  .search-dropdown {
    box-shadow: var(--box-shadow);

    @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px)  {
      width: calc(100vw - 16px);
    max-width: 600px;
    }

    @media only screen and ${media.md} {
      max-width: 323px;
    }
  }

  a {
    color: var(--primary-color);
    &:hover,:active {
      color: var(--ant-primary-color-hover);
    }
  }
  
  .d-none {
    display: none;
  }

  .ant-picker-cell {
    color: var(--text-main-color);
  }

  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.bold};
  }

  .ant-picker svg {
    color: var(--text-light-color);
  }

  // notifications start
  .ant-notification-notice {
    width: 36rem;
    padding: 2rem;
    min-height: 6rem;
    
    .ant-notification-notice-with-icon .ant-notification-notice-message {
      margin-bottom: 0;
      margin-left: 2.8125rem;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
      margin-left: 4.375rem;
      margin-top: 0;
    }

    .ant-notification-notice-icon {
      font-size: 2.8125rem;
      margin-left: 0
    }

    .ant-notification-notice-close {
      top: 1.25rem;
      right: 1.25rem;
    }

    .ant-notification-notice-close-x {
      display: flex;
      font-size: 0.9375rem;
      color: var(--text-light-color);
    }

    .notification-without-description {
      .ant-notification-notice-close {
        top: 1.875rem;
      }
      .ant-notification-notice-with-icon .ant-notification-notice-description  {
        margin-top: 0.625rem;
      }
    }
    
    .title {
      height: 3rem;
      margin-left: 1.5rem;
      display: flex;
      align-items: center;
      font-weight: ${FONT_WEIGHT.bold};

      &.title-only {
        color: var(--text-main-color);
        font-size: ${FONT_SIZE.xs};
        height: 2rem;
        margin-left: 0.75rem;
        font-weight: ${FONT_WEIGHT.semibold};
      }
  }
  
    .description {
      color: #404040;
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.semibold};
      line-height: 1.375rem;
    }
  
    &.ant-notification-notice-success {      
      .title {
        color: var(--success-color);
      }
    }
  
    &.ant-notification-notice-info {  
      .title {
        color: var(--secondary-color);
      }
    }
  
    &.ant-notification-notice-warning {  
      .title {
        color: var(--warning-color);
      }
    }
  
    &.ant-notification-notice-error {  
      .title {
        color: var(--error-color);
      }
    }
  
    .success-icon {
      color: var(--success-color);
    }
  
    .info-icon {
      color: var(--secondary-color);
    }
  
    .warning-icon {
      color: var(--warning-color);
    }
  
    .error-icon {
      color: var(--error-color);
    }
  }
  
  .ant-menu-inline, .ant-menu-vertical {
    border-right: 0;
  }
  // notifications end
  @keyframes sway {
    0%, 100%{ transform: rotate(-8deg);}
    50%{ transform: rotate(6deg); }
  }

  .middle-button {
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    background: var(--primary-color);
    color: var(--white);
    font-size: 1.2rem;
    padding: 1rem;
    border-width: 2px;
    transform: scale(1.5) translateY(-10%);
    z-index: 999;
  }

  .filter-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    border-radius: 50%;
    color: var(--white);
    border: 0px;
    background: var(--primary-color);
    font-size: 1.5rem;
    border-width: 2px;
    z-index: 999;
  }
  
.blob {
    background: black;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    height: 2.4em;
    width: 2.4em;
    transform: scale(1);
    animation: pulse-black 2s infinite;
    margin: 0 0 -1.2em -1.2em;
  }
  .blob.green {
    background: #008640cc;
    box-shadow: 0 0 0 0 #008640cc;
    animation: pulse-green 2s infinite;
  }
  
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  .ant-picker-panel-container {
    width: 90vw;
  } 

  .ant-picker-panel, .ant-picker-date-panel, .ant-picker-body, .ant-picker-content {
    width: 100% !important;
  } 

  .ant-select-item {
    font-size: ${FONT_SIZE.xxs};
  }

  .ant-statistic-title {
    color: var(--text-light-color);
    }

  @keyframes pulse-green {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #00864088;
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(51, 217, 178, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
    }
  }
`;
