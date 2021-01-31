const mongoose = require('mongoose');
const urlRegExp = require('../helpers/regexp');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name of card required.'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Link to image for card required.'],
    validate: {
      validator(v) {
        return urlRegExp.test(v);
      },
      message: (props) => `${props.value} is not a valid link`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Owner of card required'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
