module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt').redirect('/signin');
  } catch (err) {
    next(err);
  }
};
