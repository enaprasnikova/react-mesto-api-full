const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { celebrate, Joi } = require('celebrate');

const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');

const userRoutes = require('./routes/users');

const cardRoutes = require('./routes/cards');

const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { STATUS_VALIDATION_ERROR } = require('./utils/statusCodes');

const { urlPattern } = require('./utils/utils');

const {
  STATUS_INTERNAL_ERROR,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('./utils/statusCodes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(urlPattern),
  }).unknown(true),
}), createUser);

app.use('/users', auth, userRoutes);

app.use('/cards', auth, cardRoutes);

app.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Указан неправильный путь' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(STATUS_VALIDATION_ERROR).send({ message: 'Ошибка валидации' });
  }

  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    return res.status(STATUS_CONFLICT).send({ message: 'Емейл занят' });
  }

  return res.status(STATUS_INTERNAL_ERROR).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
