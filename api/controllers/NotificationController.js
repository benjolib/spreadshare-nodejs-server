"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
/**
 * @module NotificationController
 * @description notification.
 */
module.exports = class NotificationController extends Controller {
  /**
   * get single notification detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async get(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let user = req.user;
    let { NotificationService } = this.app.services;

    let model = {
      id: id,
      userId: user.id
    };

    try {
      let notification = await NotificationService.findsingle(model);
      return res.json({
        flag: true,
        data: notification,
        message: "get notification successfully!",
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
    let model = req.body;
    let { NotificationService } = this.app.services;
    let user = req.user;
    let data = [];

    //map column with tableId
    _.map(model.id, d => {
      data.push({
        userId: user.id,
        notificationId: d,
        isRead: true
      });
    });

    try {
      let readNotification = await NotificationService.updateIsRead({
        data: data
      });
      return res.json({
        flag: true,
        data: readNotification,
        message: "Multiple notification read successfully!",
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
   * get Notification list
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let { NotificationService } = this.app.services;
    let user = req.user;
    let id = user.id;
    let body = req.body;
    let model = {
      userId: id,
      start: body.start,
      limit: body.limit
    };
    try {
      let table = await NotificationService.find(model);
      return res.json({
        flag: true,
        data: table,
        message: "Notification list",
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
