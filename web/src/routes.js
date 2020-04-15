import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Login } />
      {/* Rota com o id do usuário */}
      <Route path="/dev/:id" component={ Main } />
    </BrowserRouter>
  );
};