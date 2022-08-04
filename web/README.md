<div align="center">

## Rocketseat - Semana OmniStack 8.0
# Projeto - Aplicação Tindev Web ReactJS

</div>

<br>

<div align="center">

[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/tindev.svg)](https://github.com/RenanBorba/tindev) [![Build Status](https://img.shields.io/github/forks/RenanBorba/tindev.svg)](https://github.com/RenanBorba/tindev) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

<br>

<div align="center">

![logo](https://user-images.githubusercontent.com/48495838/80020082-d91db480-84ae-11ea-90a9-d55ba77322b2.png)

</div>

<br>

Aplicação Front-end desenvolvida em ReactJS para o clone da versão web responsiva do Tinder com o theme-dracula (dark mode), voltada para busca e matches de devs. Permite, assim, a atualização em tempo real dos matches entre desenvolvedores via WebSocket.

<br><br>

<div align="center">

![000](https://user-images.githubusercontent.com/48495838/80154891-dac2a780-8596-11ea-92d7-165acfe41924.jpg)

</div>

<br><br>

## :rocket: Tecnologias
<ul>
  <li>Components</li>
  <li>Routes</li>
  <li>react-router-dom</li>
  <li>Services API</li>
  <li>Axios</li>
  <li>useState</li>
  <li>useEffect</li>
  <li>socket.io-client WebSocket</li>
  <li>CSS</li>
  <li>theme-dracula (dark mode)</li>
</ul>
<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run start / npm start</li>
</ul>

<br><br>

## :mega: ⬇ Abaixo, as principais estruturas e interfaces:

<br><br><br>

## src/App.js
```js
import React from 'react';
import './App.css';
import drac from './assets/dracula.svg'

import Routes from './routes';

function App() {

  // Função para o dark mode
  function themeChange(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dracula');
    }
    else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  return (
    <div className="app">
      <div className="theme-switch-wrapper">
        <img src={ drac } alt="dracula logo" />
        <label className="theme-switch">
          <input
            type="checkbox"
            id="checkbox"
            onChange={ themeChange } />
          <div className="slider round"></div>
        </label>
      </div>
      <Routes />
    </div>
  );
};

export default App;
```


<br><br>


## src/App.css
```css
:root {
  --bg-color: #F5F5F5;
  --card-color: #FFE;
  --primary-color: #333;
  --secondary-color: #999;
  --third-color: #CCC
}

/* dark mode styles */
[data-theme="dracula"] {
  --bg-color: #282A35;
  --card-color: #44474A;
  --primary-color: #BD95F8;
  --secondary-color: #8BF8FD;
  --third-color: #6372A5
}

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box
}

html,body,#root,.app {
  height: 100%
}

body {
  background-color: var(--bg-color);
  color: var(--font-color)
}

body,
input,
button {
  font-family: Arial, Helvetica, sans-serif
}

.theme-switch-wrapper {
  position: fixed;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center
}

.theme-switch-wrapper img {
  height: 32px;
  margin-right: 10px
}

.theme-switch {
  display: inline-block;
  height: 34px;
  position: relative;
  width: 60px
}

.theme-switch input {
  display:none
}

.slider {
  background-color: #CCC;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s
}

.slider:before {
  background-color: #FFF;
  bottom: 4px;
  content: "";
  height: 26px;
  left: 4px;
  position: absolute;
  transition: .4s;
  width: 26px
}

input:checked + .slider {
  background-color: #66AA6D
}

input:checked + .slider:before {
  transform: translateX(26px)
}

.slider.round {
  border-radius: 34px
}

.slider.round:before {
  border-radius: 50%
}
```


<br><br>


## src/services/api.js
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

export default api;
```


<br><br>


## src/pages/Login.js

```js
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
```


<br><br>

## Interface inicial
![00](https://user-images.githubusercontent.com/48495838/74781966-56dffc80-5281-11ea-83e3-b88ccc97c2bb.JPG)

<br><br>

### Interface inicial (dracula-theme)
![01](https://user-images.githubusercontent.com/48495838/74781987-5fd0ce00-5281-11ea-8c8f-cfa54046b710.JPG)

<br><br>

![02](https://user-images.githubusercontent.com/48495838/74782031-7aa34280-5281-11ea-8362-7da318e4e33e.JPG)

<br><br><br><br>


## src/pages/Main.js
```js
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
```


<br><br>


## Interface após o login do usuário

![a1](https://user-images.githubusercontent.com/48495838/76780622-214d0700-678c-11ea-94e0-666bb8370d35.png)
<br><br>


![a2](https://user-images.githubusercontent.com/48495838/76780629-2316ca80-678c-11ea-9821-696fb3555f71.png)
<br><br>


![a3](https://user-images.githubusercontent.com/48495838/76780631-23af6100-678c-11ea-9681-ace4cf3ece27.PNG)
<br><br>


![a4](https://user-images.githubusercontent.com/48495838/76780634-2447f780-678c-11ea-90d8-ea7efe0f975a.PNG)
<br><br><br>


### Interface após o match entre os usuários (Após realizar login com outro usuário)

![07](https://user-images.githubusercontent.com/48495838/74782494-5136e680-5282-11ea-97d8-8b4b727744dd.JPG)
<br><br>


![a5](https://user-images.githubusercontent.com/48495838/76780721-42155c80-678c-11ea-9a53-ed0a8f33db1a.PNG)
<br><br>


![a6](https://user-images.githubusercontent.com/48495838/76780725-43468980-678c-11ea-8140-308e6de84d40.PNG)
