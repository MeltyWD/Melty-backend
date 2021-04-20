const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const Unauthorized = require('../errors/unauthorized-error');
const { authorizedFailMessage } = require('../utils/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(data) {
        return validator.isEmail(data);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    validate: {
      validator(data) {
        return validator.isStrongPassword(data);
      },
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function userLogin(email, password) {
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
    // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Unauthorized(authorizedFailMessage));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized(authorizedFailMessage));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
