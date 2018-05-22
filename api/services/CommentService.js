"use strict";

const Service = require("trails/service");
const _ = require("lodash");
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

  /**
   * Get list of comments
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  find(fields) {
    let { TableComment } = this.app.orm;
    let criteria = {};

    if (fields.hasOwnProperty("tableId")) {
      criteria.tableId = fields.tableId;
    }

    return TableComment.findAll({
      where: criteria,
      offset: parseInt(fields.start),
      limit: parseInt(fields.limit)
    }).then(data => {
      if (_.isEmpty(data)) throw new Error("Comment not found!");

      return _.map(data, comment => {
        return comment.toJSON();
      });
    });
  }
};
