const Joi = require("joi");
const _ = require("lodash");

module.exports = class AuthValidator {
  list() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
