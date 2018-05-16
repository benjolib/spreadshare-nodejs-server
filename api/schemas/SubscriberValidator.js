const Joi = require("joi");
const _ = require("lodash");

module.exports = class SubscriberValidator {
  subscribe() {
    return Joi.object().keys({
      type: Joi.string(),
      tableId: Joi.number(),
      status: Joi.string()
    });
  }
};
