"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
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

  /**
   * update isRead of read notification
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async read(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { NotificationService } = this.app.services;

    try {
      let read = await NotificationService.updateIsRead(true, id);
      return res.json({
        flag: true,
        data: read,
        message: "Success",
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
};
