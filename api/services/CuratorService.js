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

  /**
   * list of all curators
   * @param fields
   * @returns {Promise<T>}
   */
  find(fields) {
    let { sequelize } = this.app.orm.User;
    let {
      USER,
      TABLE,
      USER_FOLLOWERS,
      VOTE
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

    let condSql = "";
    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;

    let sql = `select distinct(u.id), u.* ,               
          (select count(*)::int from ${schema}.${USER_FOLLOWERS} uf where uf."userId"=u.id) as totalfollowers,
          (select count(*)::int from ${schema}.${USER_FOLLOWERS} uf where uf."followedBy"=u.id) as totalfollowings,
          (select count(*)::int from ${schema}.${TABLE} t where t."owner"=u.id and t."isPublished"= true) as Tablelist,
          (select count(*)::int from ${schema}.${VOTE} v where v."userId" = u.id) as totalShare
          from ${schema}.${USER} u 
          join ${schema}.${VOTE} v on v."userId"=u.id 
          left join ${schema}.${TABLE} t on t.owner = u.id
          where v."itemId"=t.id
          ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result)) throw new Error(`No user profile found!.`);
        let user = result[0];
        return _.omit(
          user,
          "emailConfirmationToken",
          "passwordResetToken",
          "password"
        );
      })
      .catch(err => {
        throw err;
      });
  }
};
