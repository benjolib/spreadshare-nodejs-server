const Joi = require("joi");
const _ = require("lodash");

module.exports = class TagsValidator {
  list() {
    return Joi.object().keys({
      search: Joi.string(),
      start: Joi.number(),
      limit: Joi.number()
    });
  }
  add() {
    return Joi.object().keys({
      title: Joi.string(),
      userId: Joi.number()
    });
  }
};
