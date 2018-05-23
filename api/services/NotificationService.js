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
    let { sequelize } = this.app.orm.Table;

    let {
      USER_NOTIFICATION,
      USER_FOLLOWERS,
      TABLE_SUBSCRIPTION
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    sql = `select n.*
                from ${schema}.${USER_NOTIFICATION} n
                join ${schema}.${USER_FOLLOWERS} uf on uf."userId"= n."userId"
                join ${schema}.${TABLE_SUBSCRIPTION} 
                where n."createdBy"=${fields.userId}  
                ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`No row list found`);
        return rows;
      })
      .catch(err => {
        throw err;
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
