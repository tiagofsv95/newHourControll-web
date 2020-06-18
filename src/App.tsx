import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { MyThemeProvider } from './hooks/themeContext';
import GlobalStyle from './styles/global';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <MyThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </MyThemeProvider>
  );
};

export default App;
