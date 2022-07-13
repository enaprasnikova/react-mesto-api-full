const Cards = require('../models/card');

const {
  STATUS_SUCCESS,
  STATUS_SUCCESS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_FORBIDDEN,
} = require('../utils/statusCodes');

const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports.getCards = (req, res) => {
  Cards.find({}, '-__v')
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((cards) => {
      res.status(STATUS_SUCCESS).send(cards);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => {
      card.populate('owner', '-password -__v')
        .then((populatedCard) => {
          res.status(STATUS_SUCCESS_CREATED).send({
            _id: populatedCard._id,
            name: populatedCard.name,
            link: populatedCard.link,
            owner: populatedCard.owner,
            likes: populatedCard.likes,
            createdAt: populatedCard.createdAt,
          });
        });
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId, '-__v')
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((card) => {
      if (!card) {
        throwError(STATUS_NOT_FOUND, 'Карточка не найдена');
      }

      if (req.user._id !== card.owner._id.toString()) {
        throwError(STATUS_FORBIDDEN, 'Нет прав на удаление карточки');
      }
      return card;
    })
    .then((card) => {
      card.remove();
      res.status(STATUS_SUCCESS).send(card);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
      fields: '-__v',
    },
  )
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((card) => {
      if (!card) {
        throwError(STATUS_NOT_FOUND, 'Карточка не найдена');
      }
      res.status(STATUS_SUCCESS).send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      fields: '-__v',
    },
  )
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((card) => {
      if (!card) {
        throwError(STATUS_NOT_FOUND, 'Карточка не найдена');
      }
      res.status(STATUS_SUCCESS).send(card);
    })
    .catch(next);
};
