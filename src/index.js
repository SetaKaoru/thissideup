// File: src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/Theme';
import { BrowserRouter } from 'react-router-dom';
// Import Context Providers here if they are global
// For now, they will be in App.js for better organization of imports

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />       
              <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);