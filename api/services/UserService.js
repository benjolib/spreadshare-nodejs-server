"use strict";

const Service = require("trails/service");
const _ = require("lodash");
/**
 * @module UserService
 * @description user
 */
module.exports = class UserService extends Service {
  findHistory(fields) {
    let { sequelize } = this.app.orm.User;
    let { TABLE, USER, TABLEVIEW } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

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

    let sql = `select t.*      
           from ${schema}.${TABLE} t 
           left join ${schema}.${USER} u on u.id = t.owner 
           left join ${schema}.${TABLEVIEW} tw on tw."userId" = u.id
           where u.id = ${fields.id} ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        return _.map(result, data => {
          return data;
        });
      })
      .catch(err => {
        throw err;
      });
  }
};
