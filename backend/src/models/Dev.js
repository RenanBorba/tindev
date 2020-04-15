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