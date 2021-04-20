const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserProfile, updateProfile,
} = require('../controllers/users');

router.get('/me', getUserProfile);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    organization: Joi.string().max(3000),
  }),
}), updateProfile);

module.exports = router;
