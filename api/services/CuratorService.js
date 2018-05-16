"use strict";

const Service = require("trails/service");
const _ = require("lodash");
/**
 * @module CuratorService
 * @description curator
 */
module.exports = class CuratorService extends Service {
  /**
   * add follower
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  create(fields) {
    let { UserFollower } = this.app.orm;

    return UserFollower.create(fields).then(data => {
      return data.toJSON();
    });
  }

  /**
   * remove follower
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  remove(id) {
    let { UserFollower } = this.app.orm;

    return UserFollower.destroy({ where: { userId: id } }).then(data => {
      return data;
    });
  }

  find(fields) {
    let { sequelize } = this.app.orm.User;
    let { schema } = sequelize.options;

    let cond = [],
      orderby = "",
      condSql = "";
    let params = [];

    if (fields.hasOwnProperty("id")) {
      cond.push("ft.userId = $" + (params.length + 1));
      params.push(fields.id);
    }

    let whereCond = cond.length ? " WHERE " + cond.join(" AND ") : "";

    if (fields.hasOwnProperty("sort")) {
      orderby =
        " ORDER BY " +
        fields.sort +
        (fields.order && fields.order === "asc" ? " ASC" : " DESC");
    }

    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;

    let sql = `SELECT * FROM (
              SELECT DISTINCT ON(u.id) u.id, u.name,u.username,u.image, u.followers,u.following,
              case when  ft.followedBy > 0 then TRUE else FALSE end as isfollowing,
              case when v.itemId = t.id then TRUE else FALSE 
              FROM ${schema}.${UserFollower} ft.userId = u.id
              LEFT JOIN ${schema}.${Table} t ON  t.userId = u.id 
              LEFT JOIN ${schema}.${Vote} v ON v.userId = t.owner 
              AND fm.follower = $1 ${whereCond} ) t2 ${condSql} ${orderby}`;

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result)) throw new Error("data not found.");

        return result;
      })
      .catch(err => {
        throw err;
      });
  }
};
