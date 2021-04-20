const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300000,
  },
  image: {
    type: String,
    required: true,
    validate(value) {
      const urlPattern = /(http|https):\/\/(www\.)?([\w-])+(\.\w{2,6})\/?([\w-._~:/?#[\]@!$&'()*+,;=])*#?/;
      const urlRegExp = new RegExp(urlPattern);
      return value.match(urlRegExp);
    },
    message: (props) => `${props.value} не действительный URL`,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
    default: [],
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('post', postSchema);
