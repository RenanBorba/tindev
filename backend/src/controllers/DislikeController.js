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