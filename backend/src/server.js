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