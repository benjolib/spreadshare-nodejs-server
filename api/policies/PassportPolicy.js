"use strict";

const Policy = require("trails/policy");
const passport = require("passport");
const JWT = require("jsonwebtoken");

/**
 * @module PassportPolicy
 * @description passport policy
 */
module.exports = class PassportPolicy extends Policy {
  /**
   * Check if user is logged in or not
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  authenticate(req, res, next) {
    if (req.user) return next();
    if (req.session.user) {
      req.user = req.session.user;
      return next();
    }
    if (req.cookies.uid) {
      req.user = { id: req.cookies.uid };
      return next();
    }
    return res.json({
      flag: false,
      data: {},
      message: "You are not authorized",
      code: 500
    });
  }

  /**
   * Passport basic strategy middleware
   * @param req
   * @param res
   * @param next
   */
  basic(req, res, next) {
    passport.authenticate("basic", { session: false })(req, res, next);
  }

  /**
   * Passport JWT strategy middleware
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  jwt(req, res, next) {
    let { jwt } = this.app.config.passport.strategies;
    let { authorization } = req.headers;

    try {
      let token = JWT.verify(
        authorization.substring(4),
        jwt.tokenOptions.secret
      );
      if (token) req.user = token;
      if (!token) throw new Error("You are not authorized");
      return next();
    } catch (e) {
      return res.json({
        flag: false,
        data: {},
        message: e.message || e,
        code: 500
      });
    }
    // passport.authenticate('jwt', { session: false })(req, res, next)
  }

  /**
   * Passport facebook strategy middleware
   * @param req
   * @param res
   * @param next
   */
  facebook(req, res, next) {
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }

  /**
   * Passport google strategy middleware
   * @param req
   * @param res
   * @param next
   */
  google(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }

  /**
   * Passport twitter strategy middleware
   * @param req
   * @param res
   * @param next
   */
  twitter(req, res, next) {
    passport.authenticate("twitter")(req, res, next);
  }
};
