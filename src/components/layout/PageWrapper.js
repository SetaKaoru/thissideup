import React from 'react';
import styled from 'styled-components';

const MainContent = styled.main`
  padding-top: var(--header-height, 70px); /* Value from index.css */
  padding-bottom: calc(var(--spacing-xl, 32px) * 2); /* Ensure enough space before footer */
  min-height: calc(100vh - var(--header-height, 70px) - var(--footer-height, 100px)); /* Adjust footer height if different */
  width: 100%;
  max-width: 1400px; /* Optional: max width for content area */
  margin: 0 auto; /* Center content if max-width is used */
  padding-left: var(--spacing-m, 16px);
  padding-right: var(--spacing-m, 16px);
`;

const PageWrapper = ({ children }) => <MainContent>{children}</MainContent>;

export default PageWrapper;