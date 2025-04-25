import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes/Routes';
import { ContextProvider } from './context/AuthContext';

const App = () => (
  <BrowserRouter>
    <ContextProvider>

      <AppRoutes />
    </ContextProvider>
  </BrowserRouter>
);

export default App;
