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
    let { CommentService, NotificationService } = this.app.services;
    let { COMMENTS } = this.app.config.constants.notificationType;
    let user = req.user;
    let params = req.params;
    let table = req.table;

    let model = {
      tableId: params.id,
      parentId: body.parentId,
      userId: user.id,
      comment: body.comment
    };
    try {
      let comment = await CommentService.create(model);
      res.json({
        flag: true,
        data: comment,
        message: "Successfully comment added!",
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
        notificationType: COMMENTS,
        text: `Commented by`,
        userId: table.owner
      };
      let notification = await NotificationService.create(fields);
      console.log(notification);
    } catch (e) {}
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
        message: "Successfully removem comment",
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
        message: "comments list",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({ flag: false, data: e, message: e.message, code: 500 });
    }
  }
};
