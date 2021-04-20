const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getComments, createComment, deleteComment } = require('../controllers/comments.js');

router.get('/', getComments);

router.post('/:postId', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().hex().length(24),
  }),
}), createComment);

router.delete('/:commentId', celebrate({
  params: Joi.object().keys({
    commentId: Joi.string().hex().length(24),
  }),
}), deleteComment);

module.exports = router;
