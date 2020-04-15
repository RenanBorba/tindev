import React, { useState } from 'react';

import api from '../services/api';
import './Login.css';
import logo from '../assets/logo.svg';

// prop history (navigation)
export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    // Previnir com o comportamento padrão
    e.preventDefault();

    // Enviar param. username na rota de Devs da api
    const response = await api.post('/devs', {
      username
    });

    const { _id } = response.data;

    // Navegação
    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={ handleSubmit }>
        <img src={ logo } alt="Tindev"/>
        <input
          placeholder="Digite seu usuário no Github"
          value={ username }
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
