"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
const moment = require("moment");

/**
 * @module SearchController
 * @description search &amp; feed apis.
 */
module.exports = class SearchController extends Controller {
  /**
   * Get tables list by search
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let { TableService } = this.app.services;
    let { tableSortType } = this.app.config.constants;
    let body = req.body;
    let defaultSort = {};
    defaultSort[tableSortType.SPREADS] = "desc";

    let sort = body.sort && !_.isEmpty(body.sort) ? body.sort : defaultSort;
    let sortKey = Object.keys(sort)[0];

    let model = {
      start: body.start,
      limit: body.limit,
      sort: sortKey,
      order: sort[sortKey],
      isPublished: true,
      term: body.term
    };

    try {
      let table = await TableService.findPopular(model);
      return res.json({
        flag: true,
        data: table,
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
