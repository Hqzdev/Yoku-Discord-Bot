const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 345,
  },
  level: {
    type: Number,
    default: 1,
  },
});

module.exports = model('Level', levelSchema);