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