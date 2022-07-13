const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { urlPattern } = require('../utils/utils');

const {
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlPattern),
  }),
}), updateUserAvatar);

module.exports = router;
