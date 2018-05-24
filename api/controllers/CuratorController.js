"use strict";

const Controller = require("trails/controller");

/**
 * @module CuratorController
 * @description curator.
 */
module.exports = class CuratorController extends Controller {
  /**
   * add follower
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async follow(req, res) {
    let params = req.params;
    let { CuratorService, NotificationService } = this.app.services;
    let { FOLLOW } = this.app.config.constants.notificationType;
    let user = req.user;
    let id = params.id;
    let follower;
    try {
      let data = {
        userId: id,
        followedBy: user.id
      };

      follower = await CuratorService.create(data);

      res.json({
        flag: true,
        data: follower,
        message: "followed Successfully!",
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
        notificationType: FOLLOW,
        text: `following by`,
        userId: id,
        itemId: follower.id
      };
      let notification = await NotificationService.create(fields);
      console.log(notification);
    } catch (e) {}
  }

  /**
   * remove follower
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async unfollow(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { CuratorService } = this.app.services;
    try {
      let unfollow = await CuratorService.remove(id);
      return res.json({
        flag: true,
        data: unfollow,
        message: "Successfully unfollowed!",
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
   * get curator list
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let model = req.body;
    let user = req.user;
    let { CuratorService } = this.app.services;
    let data = {
      limit: model.limit,
      start: model.start,
      userId: user.id
    };
    try {
      let curator = await CuratorService.find(data);
      return res.json({
        flag: true,
        data: curator,
        message: "curator list",
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
