const Joi = require("joi");
const _ = require("lodash");

module.exports = class CuratorValidator {
  list() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
