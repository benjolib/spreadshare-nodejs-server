"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
/**
 * @module UserController
 * @description user.
 */
module.exports = class UserController extends Controller {
  /**
   * Get user table viewded history
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async history(req, res) {
    let { UserService } = this.app.services;
    let { CREATED_AT } = this.app.config.constants.tableSortType;
    let body = req.body;
    let user = req.user;
    let defaultSort = {};
    defaultSort[CREATED_AT] = "desc";

    let sort = body.sort && !_.isEmpty(body.sort) ? body.sort : defaultSort;
    let sortKey = Object.keys(sort)[0];

    let model = {
      start: body.start,
      limit: body.limit,
      sort: sortKey,
      order: sort[sortKey],
      id: user.id
    };
    try {
      let table = await UserService.findHistory(model);
      return res.json({
        flag: true,
        data: table,
        message: " User History ",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * get user statistics
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async statistic(req, res) {
    let model = req.body;
    let user = req.user;
    let { UserService } = this.app.services;
    let { SUBSCRIBE } = this.app.config.constants.user.status;

    let data = {
      limit: model.limit,
      start: model.start,
      userId: user.id,
      status: SUBSCRIBE
    };
    try {
      let statistics = await UserService.find(data);
      return res.json({
        flag: true,
        data: {
          totalsubscriber: statistics.totalsubscriber,
          totalpublications: statistics.totalpublications,
          totalcollaborations: statistics.totalcollaborations
        },
        message: "User Statistics",
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
   * get user publications
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async publication(req, res) {
    let model = req.body;
    let user = req.user;
    let { UserService } = this.app.services;

    let data = {
      limit: model.limit,
      start: model.start,
      userId: user.id
    };

    try {
      let list = await UserService.findPublication(data);
      _.map(list, data => {
        if (data.owner == user.id) {
          data.role = "curator";
        } else {
          data.role = "Collaborator";
        }
      });
      list.role = data.role;
      return res.json({
        flag: true,
        data: {
          list
        },
        message: "User publications",
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
   * Forgot Password (change user password and mail it to user if user forgot the password)
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async forgotPassword(req, res) {
    let model = req.body;
    let { UserService, ProfileService } = this.app.services;
    let user;

    model.email = model.email.toLowerCase();

    //check user exist by checking email
    try {
      user = await ProfileService.get(model.email);
    } catch (e) {
      return res.json({
        flag: false,
        message: e.message || `User profile not found.`
      });
    }

    //Create password Token
    try {
      let token = await UserService.createPasswordToken(user.id);
      if (!token || !token.code) throw new Error(`couldn't find token`);

      // Send email for reset password link using sendgrid
      let maildata = {};
      maildata.to = model.email;
      maildata.subject = `Reset your password on spreadshare.com`;
      maildata.text = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.
         Please click on the following link, or paste this into your browser to complete the process:
         http://${req.headers.host}/#/access/reset/${token.code}
         If you did not request this, please delete this email and your password will remain unchanged.`;

      res.json({
        flag: true,
        message: `Please check your email, Reset password link is sent to your email`,
        data: { message: maildata.text, token: token.code } //todo to remove
      });

      //Todo to send Email
      // EmailService.sendEmail(maildata, (err, data) => {
      //   if (err || !token)
      //     return res.status(statusCode.INTERNAL_SERVER_ERROR).json({flag: false, message: `Failed to send mail`, errorcode: `emailFailed`});
      //
      //   res.status(statusCode.OK).json({
      //     flag: true,
      //     message: `Please check your email, Reset password link is sent to your email`
      //   });
      // });
    } catch (e) {
      res.json({
        flag: false,
        message: `could not create token,${e.message}`,
        errorcode: `Couldn'tCreateToken`
      });
    }
  }

  /**
   * Reset Password Using Token (generated by forgot password api)
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async resetPasswordWithToken(req, res) {
    let model = req.body;
    let params = req.params;

    let { UserService, ProfileService } = this.app.services;
    let { resetPasswordStatusType } = this.app.config.constants;

    //Check password token exist, & update its accessed detail for token
    try {
      let token = await UserService.getPasswordToken(params.token);

      //Check token expired or not
      if (token && token.status == resetPasswordStatusType.ACCESSED) {
        throw new Error(`This token is already used`);
      } else {
        // if token found then update user password
        await ProfileService.update({ password: model.password }, token.userId);
        // Update Status In token table
        await UserService.updatePasswordToken(
          { status: resetPasswordStatusType.ACCESSED },
          token.id
        );
      }

      res.json({ flag: true, message: `Password changed successfully.` });
    } catch (e) {
      res.json({ flag: false, message: e.message });
    }
  }

  /**
   * Change password
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async changePassword(req, res) {
    let { ProfileService } = this.app.services;
    let body = req.body,
      user;
    let loginUser = req.user; //get login user

    try {
      user = await ProfileService.checkExist(loginUser.id);

      //Validate old password
      if (ProfileService.validatePassword(body.oldpassword, user.password)) {
        await ProfileService.update({ password: body.password }, loginUser.id);
      } else {
        throw new Error(`Old password wrong!`);
      }

      return res.json({
        flag: true,
        message: `Your password changed successfully`
      });
    } catch (e) {
      return res.json({
        flag: false,
        message: `Couldn't change password,${e.message}`
      });
    }
  }

  /**
   * Confirm user email and set active user
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async confirmEmail(req, res) {
    let params = req.params;

    let { ProfileService } = this.app.services;
    let { user } = this.app.config.constants;

    //Check password token exist, & update its accessed detail for token
    try {
      // if token found then confirm email & set status Active
      await ProfileService.updateConfirmed(
        { confirmed: true, status: user.status.ACTIVE },
        params.token
      );

      res.json({
        flag: true,
        message: `Your email has been confirmed you can access your account by login!`
      });
    } catch (e) {
      res.json({ flag: false, message: e.message });
    }
  }
};
