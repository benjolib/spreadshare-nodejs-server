"use strict";

const Service = require("trails/service");
const _ = require("lodash");
/**
 * @module SubscriberService
 * @description subscriber
 */
module.exports = class SubscriberService extends Service {
  /**
   * find list
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  find(fields) {
    let { TableSubscription } = this.app.orm;
    let criteria = {};

    if (fields.hasOwnProperty("type")) {
      criteria.type = fields.type;
    }

    if (fields.hasOwnProperty("tableId")) {
      criteria.tableId = fields.tableId;
    }

    return TableSubscription.findAll({ where: criteria }).then(result => {
      if (_.isEmpty(result)) throw new Error("Subscriber Not found!");
      return _.map(result, data => {
        return data.toJSON();
      });
    });
  }

  /**
   * add subscriber
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  subscribe(fields) {
    let { TableSubscription } = this.app.orm;

    return TableSubscription.create(fields).then(data => {
      if (_.isEmpty(data)) throw new Error("Subscriber Not created!");
      return data.toJSON();
    });
  }

  /**
   * remove subscriber
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  destroy(id) {
    let { TableSubscription } = this.app.orm;

    return TableSubscription.destroy({ where: { id } }).then(data => {
      return data;
    });
  }
};
