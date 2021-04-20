const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300000,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('comment', commentSchema);
