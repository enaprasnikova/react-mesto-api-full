const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Users = require('../models/user');

const SALT_ROUNDS = 10;

const SECRET_KEY = 'very-secret';

const {
  STATUS_SUCCESS,
  STATUS_SUCCESS_CREATED,
  STATUS_VALIDATION_ERROR,
  STATUS_NOT_FOUND,
  STATUS_FORBIDDEN,
  STATUS_UNAUTHORIZED_ERROR,
} = require('../utils/statusCodes');

const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throwError(STATUS_VALIDATION_ERROR, 'Не передан емейл или пароль');
  }

  Users.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throwError(STATUS_FORBIDDEN, 'Неправильный емейл или пароль');
      }

      return Promise.all([
        foundUser,
        bcrypt.compare(password, foundUser.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throwError(STATUS_FORBIDDEN, 'Неправильный емейл или пароль');
      }

      return jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(STATUS_UNAUTHORIZED_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getUserInfo = (req, res, next) => {
  Users.findById(req.user._id, '-password -__v')
    .then((user) => {
      if (!user) {
        throwError(STATUS_NOT_FOUND, 'Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId, '-password -__v')
    .then((user) => {
      if (!user) {
        throwError(STATUS_NOT_FOUND, 'Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throwError(STATUS_VALIDATION_ERROR, 'Не передан емейл или пароль');
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_SUCCESS_CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  Users.find({}, '-password -__v')
    .then((users) => {
      res.status(STATUS_SUCCESS).send(users);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  Users.findByIdAndUpdate(
    owner,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      fields: '-password -__v',
    },
  )
    .then((user) => {
      if (!user) {
        throwError(STATUS_NOT_FOUND, 'Пользователь не найден');
      }
      res.send(user);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  Users.findByIdAndUpdate(
    owner,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      fields: '-password -__v',
    },
  )
    .then((user) => {
      if (!user) {
        throwError(STATUS_NOT_FOUND, 'Пользователь не найден');
      }
      res.send(user);
    });
};
