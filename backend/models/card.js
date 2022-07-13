const mongoose = require('mongoose');

const { Types } = require('mongoose');

const { urlPattern } = require('../utils/utils');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlPattern.test(value),
    },
  },
  owner: {
    type: Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
