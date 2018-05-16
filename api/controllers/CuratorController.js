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
    let model = req.body;
    let { CuratorService } = this.app.services;
    let user = req.user;
    try {
      let data = {
        userId: user.id,
        followedBy: model.followedBy
      };

      let follower = await CuratorService.create(data);
      return res.json({
        flag: true,
        data: follower,
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

  async list(req, res) {
    let model = req.body;
    let { CuratorService } = this.app.services;

    try {
      let curator = await CuratorService.find(model);
      return res.json({
        flag: true,
        data: curator,
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
