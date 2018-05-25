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
  findsingle(fields) {
    let { sequelize } = this.app.orm.Table;

    let {
      USER_NOTIFICATION,
      USER,
      TABLE_ROW,
      USER_FOLLOWERS
    } = this.app.config.constants.tables;
    let {
      COLLABORATE,
      COLLABORATE_UPDATE_STATUS,
      COMMENTS,
      FOLLOW,
      SUBSCRIBE,
      NEW_LIST
    } = this.app.config.constants.notificationType;
    let { schema } = sequelize.options;
    let sql = ``;

    sql = `   
        select n.*,u.name,tr."tableId" 
        from ${schema}.${USER_NOTIFICATION} n
        join ${schema}.${USER} u on u.id = n."createdBy"
        left join ${schema}.${TABLE_ROW} tr on tr.id = n."itemId"
        where (
        (type='${FOLLOW}' and ${
      fields.userId
    } IN(select "userId" from ${schema}.${USER_FOLLOWERS} where id=n."itemId"::int))
        or
        (type='${COLLABORATE}' and n."userId"= ${fields.userId})
        or
        (type='${COLLABORATE_UPDATE_STATUS}' and n."userId"= ${fields.userId})
         or
        (type='${SUBSCRIBE}' and n."userId"= ${fields.userId})
         or
        (type='${NEW_LIST}' and  ${
      fields.userId
    } IN(select "followedBy" from  ${schema}.${USER_FOLLOWERS} where "userId"=n."createdBy"))
        or 
        (type='${COMMENTS}' and n."userId"= ${fields.userId})
        ) and n.id =${fields.id}
        `;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`Notification not found`);
        return rows;
      })
      .catch(err => {
        throw err;
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
      USER,
      TABLE_ROW,
      USER_FOLLOWERS,
      TABLE_SUBSCRIPTION
    } = this.app.config.constants.tables;
    let {
      COLLABORATE,
      COLLABORATE_UPDATE_STATUS,
      COMMENTS,
      FOLLOW,
      SUBSCRIBE,
      NEW_LIST
    } = this.app.config.constants.notificationType;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    sql = `   
        select n.*,u.name,tr."tableId" 
        from ${schema}.${USER_NOTIFICATION} n
        join ${schema}.${USER} u on u.id = n."createdBy"
        left join ${schema}.${TABLE_ROW} tr on tr.id = n."itemId"
        where (
        (type='${FOLLOW}' and ${
      fields.userId
    } IN(select "userId" from ${schema}.${USER_FOLLOWERS} where id=n."itemId"::int))
        or
        (type='${COLLABORATE}' and n."userId"= ${fields.userId})
        or
        (type='${COLLABORATE_UPDATE_STATUS}' and n."userId"= ${fields.userId})
         or
        (type='${SUBSCRIBE}' and n."userId"= ${fields.userId})
         or
        (type='${NEW_LIST}' and  ${
      fields.userId
    } IN(select "followedBy" from  ${schema}.${USER_FOLLOWERS} where "userId"=n."createdBy"))
        or 
        (type='${COMMENTS}' and ${
      fields.userId
    } In(select "userId" from ${schema}.${TABLE_SUBSCRIPTION} where "userId"=n."createdBy"))
        )${condSql}
        `;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`Notification list not found`);
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
      type: fields.notificationType,
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
