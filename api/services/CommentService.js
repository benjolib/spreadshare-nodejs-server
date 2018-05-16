"use strict";

const Service = require("trails/service");

/**
 * @module CommentService
 * @description comment
 */
module.exports = class CommentService extends Service {
  /**
   * create
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  create(fields) {
    let { TableComment } = this.app.orm;

    return TableComment.create(fields).then(data => {
      return data.toJSON();
    });
  }

  /**
   * remove comment
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  destroy(id) {
    let { TableComment } = this.app.orm;

    return TableComment.destroy({ where: { id } }).then(data => {
      return data;
    });
  }
};
