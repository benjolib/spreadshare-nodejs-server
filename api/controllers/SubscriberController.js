"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
/**
 * @module SubscriberController
 * @description subscriber.
 */
module.exports = class SubscriberController extends Controller {
  /**
   * list Subscriber
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let body = req.body;
    let { SubscriberService } = this.app.services;

    try {
      let subscribers = await SubscriberService.find(body);
      return res.json({
        flag: true,
        data: subscribers,
        message: "subscribers list",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }

  /**
   * add Subscriber
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async subscribe(req, res) {
    let body = req.body;
    let params = req.params;
    let user = req.user;
    let { SubscriberService, NotificationService } = this.app.services;
    let { SUBSCRIBE } = this.app.config.constants.subscribeType;
    let table = req.table;
    let subscriber;
    let model = {
      tableId: params.id,
      status: SUBSCRIBE,
      type: body.type,
      userId: user.id
    };
    try {
      subscriber = await SubscriberService.subscribe(model);
      res.json({
        flag: true,
        data: subscriber,
        message: "Successfully subscribe!",
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
    try {
      let fields = {
        createdBy: user.id,
        notificationType: SUBSCRIBE,
        text: `subscribe by`,
        userId: table.owner,
        itemId: subscriber.id
      };
      let notification = await NotificationService.create(fields);
      console.log(notification);
    } catch (e) {}
  }

  /**
   * remove subscriber
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async unsubscribe(req, res) {
    let params = req.params;
    let id = params.id;
    let { SubscriberService } = this.app.services;

    try {
      let tag = await SubscriberService.destroy(id);
      return res.json({
        flag: true,
        data: tag,
        message: "Successfully Unsubscribe!",
        code: 200
      });
    } catch (e) {
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }
};
