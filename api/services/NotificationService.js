"use strict";

const Service = require("trails/service");
const _ = require("lodash");
/**
 * @module NotificationService
 * @description notification
 */
module.exports = class NotificationService extends Service {
  /**
   * find Notification
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  find(id) {
    let { UserNotification } = this.app.orm;
    return UserNotification.find({ where: id }).then(data => {
      if (_.isEmpty(data)) throw new Error("notification not found");
      return data.toJSON();
    });
  }

  updateIsRead(model, id) {
    let { UserNotification } = this.app.orm;
    let isRead = model.isRead;
    return UserNotification.update(isRead, { where: { id } }).then(data => {
      return data;
    });
  }
};
