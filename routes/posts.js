const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getPosts, createPost, deletePost } = require('../controllers/posts');

router.get('/', getPosts);

router.post('/', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(1).max(300),
    text: Joi.string().required().max(300000),
    image: Joi.string(),
  }),
}), createPost);

router.delete('/:postId', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().hex().length(24),
  }),
}), deletePost);

module.exports = router;
