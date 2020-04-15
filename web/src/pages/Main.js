import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import api from '../services/api';

import './Main.css';
import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      // Obter param. match id na rota de Devs da api
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id
        }
      })

      setUsers(response.data);
    }

    loadUsers();
    /*
      Executa apenas com o param.
      de dependência de match id
    */
  }, [match.params.id]);

  useEffect(() => {
    // Conexão Websocket
    const socket = io('http://localhost:3333', {
      // query param
      query: { user: match.params.id }
    });

    // Ouvir message 'match' do websocket da api
    socket.on('match', dev => {
      /*
        Adicionar às requisições, p/ não
        sobrescrever as já feitas anteriormente
      */
      setMatchDev(dev);
    })
  }, [match.params.id]);

  async function handleLike( id ) {
    // Enviar param. match id na rota de Likes na api
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    })

    // Filtrar p/ remover a requisição recente das demais
    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike( id ) {
    // Enviar param. match id na rota de Dislikes na api
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    })

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={ logo } alt="Tindev" />
      </Link>

      {/*
        Renderizar, Se os usuários serem maior que 0
      */}
      { users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={ user._id }>
              <img src={ user.avatar } alt={ user.name } />
              <footer>
                <strong>{ user.name }</strong>  <span>{ user.user }</span>
                <p>{ user.bio }</p>
              </footer>

              <div className="buttons">
                <button type="button"
                  onClick={() => handleDislike( user._id )}>
                  <img src={ dislike } alt="Dislike" />
                </button>
                <button type="button"
                  onClick={() => handleLike( user._id )}>
                  <img src={ like } alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      /* Senão, renderizar */
      ) : (
        <div className="empty">Acabou :(</div>
      ) }

      {/* Renderizar quando der match */}
      { matchDev && (
        <div className="match-container">
          <img src={ itsamatch } alt="It's a match" />

          <img
            className="avatar"
            src={ matchDev.avatar }
            alt="Avatar"
          />
          <strong>{ matchDev.name }</strong>
          <p>{ matchDev.bio }</p>

          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      ) }
    </div>
  );
};
