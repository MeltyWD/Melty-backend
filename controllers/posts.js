const Post = require('../models/post');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  badRequestMessage,
  postNotFoundMessage,
  deleteForbiddenMessage,
} = require('../utils/messages');

module.exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate(['owner', 'comments']);
    res.send(posts);
  } catch (err) {
    next(err);
  }
};

module.exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      text,
      image,
    } = req.body;
    const movieElem = await Post.create({
      title,
      text,
      image,
      owner: req.user._id,
    });
    res.send(movieElem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const badRequestError = new BadRequest(badRequestMessage);
      next(badRequestError);
    }
    next(err);
  }
};

module.exports.deletePost = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const findMovie = await Post.findById(movieId).select('+owner')
      .orFail(new NotFoundError(postNotFoundMessage));
    if (findMovie.owner.toString() !== req.user._id) {
      throw new ForbiddenError(deleteForbiddenMessage);
    } else {
      const deleteElem = await Post.findByIdAndDelete(movieId).select('-owner');
      res.send(deleteElem);
    }
  } catch (err) {
    next(err);
  }
};
