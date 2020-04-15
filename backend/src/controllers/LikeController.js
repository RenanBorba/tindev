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