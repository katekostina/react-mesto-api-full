const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const getMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password = '',
  } = req.body;
  if (String(password).length < 8) {
    throw new BadRequestError('Пароль должен содержать не менее восьми символов.');
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: { _id: user._id, email: user.email } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных нового пользователя.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new BadRequestError('Такой пользователь уже есть.'));
      } else {
        console.error(err);
        next(err);
      }
    });
};

const updateMyProfile = (req, res, next) => {
  const myId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    myId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateMyAvatar = (req, res, next) => {
  const myId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    myId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных нового пользователя.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password = '' } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key-is-here', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateMyProfile,
  updateMyAvatar,
  login,
  getMyProfile,
};
