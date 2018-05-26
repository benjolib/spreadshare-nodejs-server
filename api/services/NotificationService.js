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
      USER_FOLLOWERS,
      READ_NOTIFICATION,
      TABLE,
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
    let sql = ``;
    let condSql = ``;
    condSql = `${condSql} LIMIT 1`;
    sql = `   
        select distinct(n.id), n.*,u.name,tr."tableId", t.title, rn."isRead"=true
        from ${schema}.${USER_NOTIFICATION} n
        join ${schema}.${USER} u on u.id = n."createdBy"
        left join ${schema}.${TABLE_ROW} tr on tr.id = n."itemId"
        left join  ${schema}.${TABLE} t on t.id = n."itemId"
        left join ${schema}.${READ_NOTIFICATION} rn on rn."notificationId" = n.id 
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
    } In( select "userId" from ${schema}.${TABLE_SUBSCRIPTION} where "tableId"=n."itemId"))
        ) and n.id =${fields.id} ${condSql}
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
   * Read Notification isRead Update
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  updateIsRead(fields) {
    let { ReadNotification } = this.app.orm;

    return ReadNotification.bulkCreate(fields.data, { returning: true }).then(
      data => {
        data = _.map(data, kw => {
          return kw.toJSON();
        });
        return data;
      }
    );
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
      TABLE_SUBSCRIPTION,
      READ_NOTIFICATION,
      TABLE
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
        select distinct(n.id), n.*,u.name,tr."tableId", t.title, rn."isRead"=true
        from ${schema}.${USER_NOTIFICATION} n
        join ${schema}.${USER} u on u.id = n."createdBy"
        left join ${schema}.${TABLE_ROW} tr on tr.id = n."itemId"
        left join  ${schema}.${TABLE} t on t.id = n."itemId"
        left join ${schema}.${READ_NOTIFICATION} rn on rn."notificationId" = n.id 
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
