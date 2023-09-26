const Joi = require("joi");

const loginValidation = user => {
  const schema = Joi.object({
    email: Joi.string()
      .ruleset.pattern(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: 'Please provide a valid E-Mail address' })
      .required(),

    password: Joi.string()
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{9,20})/
      )
      .rule({
        message:
          'Password must be at least 9 characters long and contain an uppercase charatcer, a lowercase character, a number and one of the following characters !@#$%^&*-',
      })
      .required(),
  });
  return schema.validate(user);
};

module.exports = loginValidation;