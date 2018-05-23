"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
/**
 * @module UserController
 * @description user.
 */
module.exports = class UserController extends Controller {
  /**
   * get User History
   * @param req
   * @param res
   * @returns {Promise<*>}
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
   * get user statistic
   * @param req
   * @param res
   * @returns {Promise<*>}
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
      let statistics = await UserService.findStatistic(data);
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

  async publication(req, res) {
    let model = req.body;
    let user = req.user;
    let { UserService } = this.app.services;
    // let { SUBSCRIBE } = this.app.config.constants.user.status;

    let data = {
      limit: model.limit,
      start: model.start,
      userId: user.id
      //   status: SUBSCRIBE
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
};
