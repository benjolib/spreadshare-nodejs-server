const Joi = require("joi");
const _ = require("lodash");

module.exports = class SubscriberValidator {
  subscribe() {
    return Joi.object().keys({
      type: Joi.string()
    });
  }

  list() {
    return Joi.object().keys({
      type: Joi.string(),
      tableId: Joi.number(),
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
