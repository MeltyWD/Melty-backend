const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');
const { logout } = require('../controllers/logout');

router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));

router.use(auth);

router.use('/signout', logout);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

router.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
