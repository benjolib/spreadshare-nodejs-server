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

  /**
   * update isRead for read notification
   * @param isRead
   * @param id
   * @returns {Promise<T>}
   */
  updateIsRead(isRead, id) {
    let { UserNotification } = this.app.orm;

    return UserNotification.update(
      {
        isRead
      },
      { where: { id: id } }
    )
      .then(rows => {
        return rows;
      })
      .catch(err => {
        throw err;
      });
  }
};
