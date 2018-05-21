const Joi = require("joi");
const _ = require("lodash");

module.exports = class CommentValidator {
  add() {
    return Joi.object().keys({
      parentId: Joi.number(),
      tableId: Joi.number(),
      userId: Joi.number(),
      comment: Joi.string()
    });
  }

  list() {
    return Joi.object().keys({
      tableId: Joi.number(),
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
