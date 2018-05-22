"use strict";

const Controller = require("trails/controller");

/**
 * @module CommentController
 * @description comment.
 */
module.exports = class CommentController extends Controller {
  /**
   * add comment
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async add(req, res) {
    let body = req.body;
    let { CommentService } = this.app.services;
    let user = req.user;
    let model = {
      tableId: body.tableId,
      parentId: body.parentId,
      userId: user.id,
      comment: body.comment
    };
    try {
      let comment = await CommentService.create(model);
      return res.json({
        flag: true,
        data: comment,
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
   * remove comment
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async remove(req, res) {
    let params = req.params;
    let id = params.id;
    let { CommentService } = this.app.services;

    try {
      let comment = await CommentService.destroy(id);
      return res.json({
        flag: true,
        data: comment,
        message: "Successfully remove",
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
   * get list of comments
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let model = req.body;
    let { CommentService } = this.app.services;

    try {
      let tag = await CommentService.find(model);
      return res.json({
        flag: true,
        data: tag,
        message: "tags list",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }
};
