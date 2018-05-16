"use strict";

const Controller = require("trails/controller");

/**
 * @module NotificationController
 * @description notification.
 */
module.exports = class NotificationController extends Controller {
  /**
   * get single notification
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async single(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { NotificationService } = this.app.services;

    try {
      let notification = await NotificationService.find(id);
      return res.json({
        flag: true,
        data: notification,
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

  async read(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let model = req.body;
    let { NotificationService } = this.app.services;

    try {
      await NotificationService.updateIsRead(model, id);
      return res.json({
        flag: true,
        data: column,
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
