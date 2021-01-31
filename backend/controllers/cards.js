const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

// helper
const isCardIdValid = (cardId) => {
  const validId = /^[\da-z]{24}$/;
  return validId.test(cardId);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных новой карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const me = req.user._id;
  const { cardId } = req.params;
  if (!isCardIdValid(cardId)) {
    throw new BadRequestError('Неверный формат id карточки.');
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      if (me.toString() !== card.owner.toString()) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки.');
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => {
          res.status(200).send({ data: deletedCard });
        })
        .catch(next);
    })
    .catch(next);
};

const putCardLike = (req, res, next) => {
  if (!isCardIdValid(req.params.cardId)) {
    throw new BadRequestError('Неверный формат id карточки.');
  }
  const myId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: myId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const deleteCardLike = (req, res, next) => {
  if (!isCardIdValid(req.params.cardId)) {
    throw new BadRequestError('Неверный формат id карточки.');
  }
  const myId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: myId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
