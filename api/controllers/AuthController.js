"use strict";

const Controller = require('trails/controller')
const JWT = require('jsonwebtoken')
const randtoken = require('rand-token');


/**
 * @module AuthController
 * @description auth controller.
 */
module.exports = class AuthController extends Controller {
  /**
   * User signup
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async signup(req, res) {
    let model = req.body;
    if (!model || !model.email || !model.password) {
      return res.json({
        flag: false,
        data: {},
        message: "Missing parameter",
        code: 400
      });
    }

    let etoken = randtoken.generate(16);

    let model = {
      name : body.name,
      email: body.email,
      mobile: body.mobile,
      handle: body.handle,
      emailSettings: body.emailSettings,
      username: body.username,
      password:body.password,
      description: body.description,
      location: body.location,
      tagline: body.tagline,
      image: body.image,
      emailConfirmationToken : etoken
    }

    let { User, Passport } = this.app.orm

    try {
      let user = await User.create(model);
      let passport = await Passport.create({
        user_id: user.id,
        protocol: "basic",
        password: model.password
      });
      return res.json({
        flag: true,
        data: {},
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using Basic strategy
   * @param req
   * @param res
   */
  async loginBasic(req, res) {
    let { Token } = this.app.orm;
    let { jwt } = this.app.config.passport.strategies;
    let user = req.user;
    let token;

    try {
      if (jwt)
        token = JWT.sign(user, jwt.tokenOptions.secret, {
          expiresIn: jwt.tokenOptions.expiresInSeconds
        });

      await Token.create({ user_id: user.id, token });
      return res.json({
        flag: true,
        data: { user, token },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using Session
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async loginBySession(req, res) {
    let { email, password } = req.body;
    let { User, Passport } = this.app.orm;

    try {
      let user = await User.findOne({
        where: { email },
        include: [{ model: Passport }]
      });
      if (!user) throw new Error("User not exists");
      let passport = user.Passports.find(o => {
        return o.protocol == "basic";
      });
      if (!passport) throw new Error("passport not exists");
      let isMatch = await this.app.config.passport.bcrypt.compare(
        password,
        passport.password
      );
      if (!isMatch) throw new Error("Oops! password does not match.");
      req.session.user = user;

      return res.json({
        flag: true,
        data: { user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using cookie
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async loginByCookie(req, res) {
    let { email, password } = req.body;
    let { User, Passport } = this.app.orm;

    try {
      let user = await User.findOne({
        where: { email },
        include: [{ model: Passport }]
      });
      if (!user) throw new Error("User not exists");
      let passport = user.Passports.find(o => {
        return o.protocol == "basic";
      });
      if (!passport) throw new Error("passport not exists");
      let isMatch = await this.app.config.passport.bcrypt.compare(
        password,
        passport.password
      );
      if (!isMatch) throw new Error("Oops! password does not match.");
      res.cookie("uid", user.id, { maxAge: 900000, httpOnly: true });

      return res.json({
        flag: true,
        data: { user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Check for logged in user details
   * @param req
   * @param res
   */
  async profile(req, res) {
    let { User } = this.app.orm;

    try {
      let user = await User.findOne({ where: { id: req.user.id } });
      return res.json({
        flag: true,
        data: { user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Check for jwt token
   * @param req
   * @param res
   */
  checkJWT(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Logout user
   * @param req
   * @param res
   */
  async logout(req, res) {
    let { authorization } = req.headers;
    let token = authorization.substring(4);
    let { Token } = this.app.orm;

    try {
      if (token) {
        await Token.destroy({ where: { token } });
      }
      req.logOut();

      // destroy session for logged in user
      req.session.destroy();

      // remove cookie for logged user id
      res.clearCookie("uid");

      return res.json({
        flag: true,
        data: {},
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using facebook strategy
   * @param req
   * @param res
   */
  facebook(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Callback for User log in using facebook strategy
   * @param req
   * @param res
   */
  facebookCallback(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using google strategy
   * @param req
   * @param res
   */
  google(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Callback for User log in using google strategy
   * @param req
   * @param res
   */
  googleCallback(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * User log in using twitter strategy
   * @param req
   * @param res
   */
  twitter(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Callback for User log in using twitter strategy
   * @param req
   * @param res
   */
  twitterCallback(req, res) {
    try {
      return res.json({
        flag: true,
        data: { user: req.user },
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }
};
