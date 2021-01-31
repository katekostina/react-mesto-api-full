const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegExp = require('../helpers/regexp');
const {
  updateMyProfile,
  updateMyAvatar,
  getMyProfile,
  getUsers,
  getProfile,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getMyProfile);

usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateMyProfile,
);

usersRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(urlRegExp),
    }),
  }),
  updateMyAvatar,
);

usersRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getProfile,
);

module.exports = usersRouter;
