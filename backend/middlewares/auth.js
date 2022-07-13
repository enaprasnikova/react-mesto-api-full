const jwt = require('jsonwebtoken');

const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throwError(401, 'Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'very-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throwError(401, 'Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
