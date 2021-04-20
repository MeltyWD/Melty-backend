const Comment = require('../models/comment');
const Post = require('../models/post');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  badRequestMessage,
  commentNotFoundMessage,
  deleteForbiddenMessage,
} = require('../utils/messages');

module.exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({}).populate('owner');
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

module.exports.createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const createComment = await Comment.create({
      text,
      owner: req.user._id,
      post: postId,
    });
    const postUpdate = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: createComment._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    res.send({ createComment, postUpdate });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const badRequestError = new BadRequest(badRequestMessage);
      next(badRequestError);
    }
    next(err);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const findComment = await Comment.findById(commentId).select('+owner')
      .orFail(new NotFoundError(commentNotFoundMessage));
    if (findComment.owner.toString() !== req.user._id) {
      throw new ForbiddenError(deleteForbiddenMessage);
    } else {
      const deleteComments = await Comment.findByIdAndDelete(commentId).select('-owner');
      res.send(deleteComments);
    }
  } catch (err) {
    next(err);
  }
};
