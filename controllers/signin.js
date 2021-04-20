const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const correntUser = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: correntUser._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    const sendUser = await User.findById(correntUser._id);
    res
      .status(200)
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send(sendUser);
  } catch (err) {
    next(err);
  }
};
