"use strict";

const Service = require("trails/service");

/**
 * @module CommentService
 * @description comment
 */
module.exports = class CommentService extends Service {
  create(fields) {
    let { TableComment } = this.app.orm;

    return TableComment.create(fields).then(data => {
      return data.toJSON();
    });
  }
};
