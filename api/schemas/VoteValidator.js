const Joi = require("joi");
const Constant = require("../../config/constants");
const _ = require("lodash");

module.exports = class VoteValidator {
  create() {
    return Joi.object().keys({
      itemId: Joi.number().required(),
      type: Joi.any()
        .valid(_.values(Constant.vote))
        .required()
    });
  }
};
