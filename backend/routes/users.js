const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateMyProfile,
  updateMyAvatar,
  getMyProfile,
} = require('../controllers/users');

usersRouter.get(
  '/me',
  getMyProfile,
);

usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateMyProfile,
);

usersRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
    }),
  }),
  updateMyAvatar,
);

module.exports = usersRouter;
