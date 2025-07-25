// File: src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.primaryPurple};
    margin-bottom: ${({ theme }) => theme.spacing.m};
    line-height: 1.3;
  }
  
  h1 { font-size: ${({ theme }) => theme.fontSizes.xxlarge}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.xlarge}; }
  h3 { font-size: ${({ theme }) => theme.fontSizes.large}; }


  a {
    color: ${({ theme }) => theme.colors.primaryPurple};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.primaryPurpleLight};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul {
    list-style: none;
  }
  
  button {
    font-family: ${({ theme }) => theme.fonts.main};
    cursor: pointer;
    border: none;
    padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: background-color 0.2s ease-in-out, transform 0.1s ease;

    &:active {
        transform: translateY(1px);
    }
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.main};
    padding: ${({ theme }) => theme.spacing.s};
    border: 1px solid ${({ theme }) => theme.colors.lightGrayBorder};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.textDark};

    &::placeholder {
        color: ${({ theme }) => theme.colors.inputPlaceholder};
    }
     &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primaryPurple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryPurpleLight}30; /* Light purple glow */
    }
  }
`;

