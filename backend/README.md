<div align="center">
 
## Rocketseat - Semana OmniStack 8.0
# Projeto - API Node Armazenamento Tindev Devs

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

API REST de dados Back-end em Node.js MVC, desenvolvida para o clone da aplicação Tinder, voltada para busca e matches de devs. Permite, assim, a atualização em tempo real dos matches entre desenvolvedores via WebSocket.

<br><br>

## :rocket: Tecnologias
<ul>
  <li>Nodemon</li>
  <li>MongoDB</li>
  <li>Mongoose</li>
  <li>Express</li>
  <li>Axios</li>
  <li>Routes</li>
  <li>Github API</li>
  <li>Cors</li>
  <li>Socket.io WebSocket</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run dev / npm dev</li>
</ul>

<br><br><br>

## :mega: ⬇ Abaixo, as principais estruturas:

<br><br><br>

## src/server.js
```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

// Ouvir toda conexão com usuário via socket user
io.on('connection', socket => {
  const { user } = socket.handshake.query;

  // Relacionar user com socket id
  connectedUsers[user] = socket.id;
});

// Conexão MongoDB
mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack8-60cwf.mongodb.net/test?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// next = seguir fluxo
app.use((req, res, next) => {
  // Disponibilizar acesso a todas rotas
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

// Permitir acesso de qualquer app
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
```

<br><br>

## src/routes.js
```js
const express = require('express');
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = express.Router();

// Rotas HTTP
routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes;
```

<br><br>

## src/models/Dev.js
```js
const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  bio: String,
  avatar: {
    type: String,
    required: true,
  },
  // ObjectId do usuário que deu like
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  // ObjectId do usuário que deu dislike
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
}, {
  timestamps: true,
});

module.exports = model('Dev', DevSchema);
```

<br><br>

## src/controllers/DevController.js
```js
const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  // Método Listar
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        // $ne = valor não é igual ao especificado
        { _id: { $ne: user } },
        // $nin = valor não especificado no array ou não existe
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    })

    return res.json(users);
  },

  // Método Criar
  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    // Github API
    const response = await axios.get(`https://api.github.com/users/${username}`);

    // Associar dados vindos da api do Github
    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    })

    return res.json(dev);
  }
};
```

<br><br>

## src/controllers/LikeController.js
```js
const Dev = require('../models/Dev');

module.exports = {
  // Método Criar
  async store(req, res) {
    //console.log(req.io, req.connectedUsers);

    const { user } = req.headers;
    // param. da rota
    const { devId } = req.params;

    // usuário logado
    const loggedDev = await Dev.findById(user);
    // usuário alvo do like
    let targetDev = null

    try {
      targetDev = await Dev.findById(devId);
    } catch (error) {
      return res.status(400).json({ error: 'Dev não encontrado' });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[devId];

      // Se exister uma conexão em tempo real com o loggedSocket
      if (loggedSocket) {
        // Enviar requisição 'match'
        req.io.to(loggedSocket).emit('match', targetDev);
      }

      // Se exister uma conexão em tempo real com o targetSocket
      if (targetSocket) {
        // Enviar requisição 'match'
        req.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    // Método Push
    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
```

<br><br>

## src/controllers/DislikeController.js
```js
const Dev = require('../models/Dev');

module.exports = {
  // Método Criar
  async store(req, res) {
    const { user } = req.headers;
    // param. da rota
    const { devId } = req.params;

    // usuário logado
    const loggedDev = await Dev.findById(user);
    // usuário alvo do dislike
    let targetDev = null

    try {
      targetDev = await Dev.findById(devId);
    } catch (error) {
      return res.status(400).json({ error: 'Dev não encontrado' });
    }

    // Método Push
    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
```
