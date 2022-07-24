const Cards = require('../models/card');

const { NotFoundError } = require('../errors/notFoundError');

const { ForbiddenError } = require('../errors/forbiddenError');

const { ValidatorError } = require('../errors/validationError');

const {
  STATUS_SUCCESS,
  STATUS_SUCCESS_CREATED,
} = require('../utils/statusCodes');

module.exports.getCards = (req, res, next) => {
  Cards.find({}, '-__v')
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((cards) => {
      res.status(STATUS_SUCCESS).send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidatorError('Некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId, '-__v')
    .populate('owner', '-password -__v')
    .populate('likes', '-password -__v')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
      return card;
    })
    .then((card) => card.remove())
    .then((card) => {
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
        throw new NotFoundError('Карточка не найдена');
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
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(STATUS_SUCCESS).send(card);
    })
    .catch(next);
};
