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
};
