"use strict";

const Service = require("trails/service");
const _ = require("lodash");
const randtoken = require("rand-token");
const crypto = require("crypto");

/**
 * @module UserService
 * @description user
 */
module.exports = class UserService extends Service {
  /**
   * Find User History
   * @param fields
   * @returns {Promise<T>}
   */
  findHistory(fields) {
    let { sequelize } = this.app.orm.User;
    let {
      TABLE,
      USER,
      TABLE_VIEW,
      TABLE_ROW
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let { rowStatusType, tableRowActionType } = this.app.config.constants;
    let condSql = "",
      order;

    if (fields.hasOwnProperty("sort")) {
      order = fields.order === "asc" ? "ASC" : "DESC";
      condSql = `${condSql} ORDER BY "${fields.sort}" ${order}`;
    }

    if (fields.hasOwnProperty("id")) {
    }

    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;

    let sql = `select t.* ,     
           (select count(*)::int from ${schema}.${TABLE_ROW} tr where tr."tableId" = t.id and tr."action"='${
      tableRowActionType.SUBMITTED
    }' and tr."status"= '${rowStatusType.APPROVED}') as listings
           from ${schema}.${TABLE} t 
           left join ${schema}.${USER} u on u.id = t.owner 
           left join ${schema}.${TABLE_VIEW} tw on tw."userId" = u.id
           where u.id = ${fields.id} ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result)) throw new Error(`History Not found!`);
        return _.map(result, data => {
          return data;
        });
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * find user statistics
   * @param fields
   * @returns {Promise<T>}
   */
  findStatistics(fields) {
    let { sequelize } = this.app.orm.User;
    let {
      USER,
      TABLE,
      TABLE_ROW,
      TABLE_INFO,
      TABLE_SUBSCRIPTION
    } = this.app.config.constants.tables;
    let { rowStatusType } = this.app.config.constants;
    let { schema } = sequelize.options;

    let params = [fields.userId];

    let publicationSql = `with publications as(select DISTINCT(t.id),t.title,t.description,t.id as "tableId",ti."totalSubscribers",ti."totalSpreads"                   
                   from ${schema}.${TABLE} t
                   left join ${schema}.${TABLE_ROW} tr on tr."tableId" = t.id
                   left join ${schema}.${TABLE_INFO} ti on ti."tableId" = t.id
                   where t.owner = $1 
                   or (tr."createdBy" = $1 AND tr.status = '${
                     rowStatusType.APPROVED
                   }'))`;

    let tableSql = `array(select id from ${schema}."${TABLE}" where owner=$1)`;
    let sql = `${publicationSql} select count(*)::int as publications,
                   (select count(*)::int from ${schema}.${TABLE_SUBSCRIPTION} where "tableId"=ANY(${tableSql})) as subscribers,
                   (select count(*)::int from ${schema}.${TABLE_ROW} tr where tr."status"= '${
      rowStatusType.APPROVED
    }' and tr."tableId" = ANY(${tableSql})) as collaborations
                   from publications`;

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result))
          throw new Error(`No user statistics data found!.`);

        return result[0];
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * find publications of user
   * @param fields
   * @returns {Promise<T>}
   */
  findPublication(fields) {
    let { sequelize } = this.app.orm.User;
    let { TABLE_ROW, TABLE, TABLE_INFO } = this.app.config.constants.tables;
    let { rowStatusType, tableRowActionType } = this.app.config.constants;
    let { schema } = sequelize.options;

    let condSql = "",
      params = [fields.userId];
    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;

    let listingSql = `(select count(*)::int from ${schema}.${TABLE_ROW} tr where tr."tableId" = t.id and tr."action"='${
      tableRowActionType.SUBMITTED
    }' and tr."status"= '${rowStatusType.APPROVED}') as listings`;
    let contributionSql = `(select count(*)::int from ${schema}.${TABLE_ROW} tr where tr."tableId" = t.id and tr."action"='${
      tableRowActionType.SUBMITTED
    }' and tr."status"= '${
      rowStatusType.APPROVED
    }' and "createdBy"=$1) as totalcontribution`;

    let sql = `select DISTINCT(t.id),t.title,t.description,t.id as "tableId",ti."totalSubscribers",ti."totalSpreads"
                   ,${listingSql}
                   ,${contributionSql}
                   from ${schema}.${TABLE} t
                   left join ${schema}.${TABLE_ROW} tr on tr."tableId" = t.id
                   left join ${schema}.${TABLE_INFO} ti on ti."tableId" = t.id
                   where t.owner = $1 or (tr."createdBy" = $1 AND tr.status = '${
                     rowStatusType.APPROVED
                   }') ${condSql}`;

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result)) throw new Error(`Table not found!.`);

        _.map(result, d => {
          d.contribution =
            parseInt(d.totalcontribution) * 100 / parseInt(d.listings);
        });

        return result;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Create User Password Token (For Forgot Password)
   * @param userid
   * @returns {Promise.<TResult>}
   */
  createPasswordToken(userid) {
    let { UserResetPassword } = this.app.orm;

    //let validtime = Math.ceil(new Date().getTime()/1000 + validhours*3600);

    let token = {
      code: randtoken.generate(48),
      userId: userid
    };

    return UserResetPassword.create(token)
      .then(token => {
        return token.toJSON();
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Get reset token detail
   * @param token
   * @returns {Promise|Promise.<TResult>|*}
   */
  getPasswordToken(token) {
    let { UserResetPassword } = this.app.orm;

    return UserResetPassword.findOne({ where: { code: token } }).then(token => {
      if (_.isEmpty(token)) throw new Error(`No token found!`);
      return token.toJSON();
    });
  }

  /**
   * update password token
   * @param fields
   * @param id
   * @returns {Promise|Promise.<TResult>|*}
   */
  updatePasswordToken(fields, id) {
    let { UserResetPassword } = this.app.orm;

    return UserResetPassword.update(fields, { where: { id } }).then(rows => {
      return rows;
    });
  }
};
