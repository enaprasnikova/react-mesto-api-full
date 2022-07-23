const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Users = require('../models/user');

const { ValidatorError } = require('../errors/validationError');

const { UnauthorizedError } = require('../errors/unauthorizedError');

const { NotFoundError } = require('../errors/notFoundError');

const { ConflictError } = require('../errors/conflictError');

const SALT_ROUNDS = 10;

const { JWT_SECRET, NODE_ENV } = process.env;

const {
  STATUS_SUCCESS,
  STATUS_SUCCESS_CREATED,
  STATUS_UNAUTHORIZED_ERROR,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../utils/statusCodes');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidatorError('Не передан емейл или пароль');
  }

  Users.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }

      return Promise.all([
        foundUser,
        bcrypt.compare(password, foundUser.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }

      return jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = STATUS_UNAUTHORIZED_ERROR;
      next(error);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  Users.findById(req.user._id, '-password -__v')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId, '-password -__v')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
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
    throw new ValidatorError('Не передан емейл или пароль');
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
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidatorError('Ошибка валидации'));
      }

      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Емейл занят'));
      }

      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({}, '-password -__v')
    .then((users) => {
      res.status(STATUS_SUCCESS).send(users);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
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
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidatorError('Некорректные данные при обновлении пользователя'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
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
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidatorError('Некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};
