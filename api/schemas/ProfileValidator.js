const Joi = require("joi");
const Constant = require("../../config/constants");
const _ = require("lodash");

module.exports = class ProfileValidator {
  updateProfile() {
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
      email: Joi.string()
    };

    return Joi.object().keys({
      username: uname,
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
      status: Joi.string(),
      locationId: Joi.number()
    });
  }

  uploadImage() {
    return Joi.object().keys({
      image: Joi.string()
        .required()
        .regex(/data:image\/(jpg|jpeg|png);base64,/)
    });
  }

  upsertConnections() {
    return Joi.object().keys({
      twitter: Joi.string(),
      facebook: Joi.string(),
      dribbble: Joi.string(),
      medium: Joi.string(),
      producthunt: Joi.string(),
      behance: Joi.string(),
      github: Joi.string(),
      gitlab: Joi.string(),
      bitbucket: Joi.string(),
      slack: Joi.string(),
      angellist: Joi.string(),
      googleplus: Joi.string(),
      stackoverlflow: Joi.string(),
      linkedin: Joi.string(),
      quora: Joi.string(),
      reddit: Joi.string(),
      ycombinator: Joi.string(),
      instagram: Joi.string(),
      visco: Joi.string(),
      soundcloud: Joi.string()
    });
  }

  forgotPassword() {
    return Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
    });
  }

  resetPassword() {
    return Joi.object().keys({
      password: Joi.string()
        .regex(/^[^\s]{4,30}$/)
        .required()
    });
  }

  changePassword() {
    return Joi.object().keys({
      password: Joi.string()
        .regex(/^[^\s]{4,30}$/)
        .required(),
      oldpassword: Joi.string()
        .regex(/^[^\s]{4,30}$/)
        .required()
    });
  }

  history() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      sort: Joi.object()
    });
  }

  statistic() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number()
    });
  }
};
