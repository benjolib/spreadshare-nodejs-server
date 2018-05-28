const Joi = require("joi");
const Constant = require("../../config/constants");
const _ = require("lodash");
module.exports = class AuthValidator {
  signup() {
    let uname = Joi.alternatives()
      .try(
        Joi.string().regex(/^\w{3,30}$/),
        Joi.string().regex(
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        )
      )
      .required();
    let emailsetup = {
      type: Joi.any().valid(_.values(Constant.user.type)),
      email: Joi.boolean()
    };

    return Joi.object().keys({
      username: uname,
      password: Joi.string()
        .regex(/^[^\s]{4,30}$/)
        .required(),
      email: Joi.string().email(),
      name: Joi.string(),
      mobile: Joi.number().integer(),
      handle: Joi.string(),
      emailSettings: Joi.array().items(Joi.object(emailsetup)),
      description: Joi.string(),
      location: Joi.string(),
      tagline: Joi.string(),
      website: Joi.string(),
      image: Joi.string(),
      emailConfirmationToken: Joi.string(),
      passwordResetToken: Joi.string(),
      lastSessionId: Joi.string(),
      confirmed: Joi.string(),
      status: Joi.string()
    });
  }

  triggerSession() {
    let uname = Joi.alternatives()
      .try(
        Joi.string().regex(/^\w{3,30}$/),
        Joi.string().regex(
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        )
      )
      .required();

    return Joi.object().keys({
      username: uname,
      password: Joi.string()
        .regex(/^[^\s]{4,30}$/)
        .required()
    });
  }
};
