const Card   = require("./mongodb/Card");
const config = require("config");
const { handleBadRequest } = require("../../utils/handleErrors");

const DB = config.get("DB") || "MONGODB";

const getCards = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find();

      return Promise.resolve(cards);
    }
    catch (error) {
      error.status = 404;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("No cards to display");
};

const getMyCards = async userId => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find({ user_id: userId });

      return Promise.resolve(cards);
    }
    catch (error) {
      error.status = 404;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("No cards in database");
};

const getCard = async cardId => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card){
        throw new Error("Card not found");
      }

      return Promise.resolve(card);
    }
    catch (error) {
      error.status = 404;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("No cards in database");
};

const createCard = async normalizedCard => {
  if (DB === "MONGODB") {
    try {
      let card = new Card(normalizedCard);
      card = await card.save();

      return Promise.resolve(card);
    }
    catch (error) {
      error.status = 400;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Database error");
};

const updateCard = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(cardId, normalizedCard, {new: true});

      if (!card){
        throw new Error("Card not found");
      }

      return Promise.resolve(card);
    }
    catch (error) {
      error.status = 400;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Database error");
};

const likeCard = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);

      if (!card){
        throw new Error("Card not found");
      }

      const cardLikes = card.likes.find(id => id === userId);

      if (!cardLikes) {
        card.likes.push(userId);
        card = await card.save();

        return Promise.resolve(card);
      }

      const cardFiltered = card.likes.filter(id => id !== userId);
      card.likes = cardFiltered;
      card = await card.save();
      return Promise.resolve(card);
    }
    catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Database error");
};

const deleteCard = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      const card = await Card.findByIdAndDelete(cardId);

      return Promise.resolve(card);
    }
    catch (error) {
      error.status = 400;

      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Database error");
};

exports.getCards   = getCards;
exports.getMyCards = getMyCards;
exports.getCard    = getCard;
exports.createCard = createCard;
exports.updateCard = updateCard;
exports.likeCard   = likeCard;
exports.deleteCard = deleteCard;