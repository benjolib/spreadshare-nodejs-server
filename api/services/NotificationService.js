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
    ).then(data => {
      if (_.isEmpty(data)) throw new Error("Is read Not updated.");
      return data;
    });
  }

  /**
   * List of Notifications
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  find(fields) {
    let { UserNotification } = this.app.orm;
    let criteria = {};

    if (fields.hasOwnProperty("userId")) {
      criteria.userId = fields.userId;
    }

    return UserNotification.findAll({
      where: criteria,
      offset: parseInt(fields.start),
      limit: parseInt(fields.limit)
    }).then(data => {
      if (_.isEmpty(data)) throw new Error(`list empty!`);
      return data;
    });
  }

  /**
   * create User Notifications
   * @param fields
   * @returns {Promise<T>}
   */
  create(fields) {
    let { UserNotification } = this.app.orm;

    let model = {
      notificationType: fields.notificationType,
      text: fields.text,
      createdBy: fields.createdBy,
      userId: fields.userId,
      itemType: fields.itemType,
      itemId: fields.itemId
    };
    return UserNotification.create(model)
      .then(msg => {
        return msg.toJSON();
      })
      .catch(err => {
        throw err;
      });
  }
};
