const validate = require("./Joi/validator");

const validator = undefined || "Joi";

const validateCard = card => {
  if (validator === "Joi") return validate(card);
};

module.exports = validateCard;