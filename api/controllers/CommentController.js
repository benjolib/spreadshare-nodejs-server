"use strict";

const Controller = require("trails/controller");

/**
 * @module CommentController
 * @description comment.
 */
module.exports = class CommentController extends Controller {
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
};
