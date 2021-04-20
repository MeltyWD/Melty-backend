const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const { userCreateConflictMessage } = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  try {
    const passwordhash = await bcrypt.hash(req.body.password, 10);
    const createUser = await User.create({
      email: req.body.email,
      password: passwordhash,
      name: req.body.name,
    });
    const sendUser = await User.findById(createUser._id);
    const token = jwt.sign(
      { _id: sendUser._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.status(200)
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send(sendUser);
  } catch (err) {
    if (err.code === 11000) {
      const conflictError = new ConflictError(userCreateConflictMessage);
      next(conflictError);
    } else {
      next(err);
    }
  }
};
