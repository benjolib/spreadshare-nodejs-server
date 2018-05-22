const Joi = require("joi");
const _ = require("lodash");

module.exports = class AuthValidator {
  follow() {
    return Joi.object().keys({
      followedBy: Joi.number()
    });
  }

  list() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
