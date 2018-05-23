"use strict";

const Controller = require("trails/controller");

/**
 * @module TagsController
 * @description tags.
 */
module.exports = class TagsController extends Controller {
  /**
   * add tags
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async add(req, res) {
    let body = req.body;
    let { TagsService } = this.app.services;

    try {
      let tags = await TagsService.create(body);
      return res.json({
        flag: true,
        data: tags,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }

  /**
   * remove tags
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async remove(req, res) {
    let params = req.params;
    let tagid = params.id;
    let { TagsService } = this.app.services;

    try {
      let tag = await TagsService.destroy(tagid);
      return res.json({
        flag: true,
        data: tag,
        message: "delete tag successfully",
        code: 200
      });
    } catch (e) {
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }

  /**
   * get list of tags
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let model = req.body;
    //let user = req.user  //login user
    let { TagsService } = this.app.services;

    try {
      let tag = await TagsService.find(model);
      return res.json({
        flag: true,
        data: tag,
        message: "tags list",
        code: 200
      });
    } catch (e) {
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }
};
