"use strict";

const Service = require("trails/service");
const _ = require("lodash");

/**
 * @module ProfileService
 * @description profile apis
 */
module.exports = class ProfileService extends Service {
  /**
   * Get user profile detail
   * @param userid
   * @returns {Promise<T>}
   */
  get(userid) {
    let { sequelize } = this.app.orm.User;
    let {
      USER,
      USER_CONNECTIONS,
      USER_FOLLOWERS,
      USER_LOCATION,
      LOCATION
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

    let sql = `select u.*,json_build_object(
                'twitter', uc.twitter,
                'facebook', uc.facebook,
                'dribbble', uc.dribbble,
                'medium', uc.medium,
                'producthunt', uc.producthunt,
                'behance', uc.behance,
                'github', uc.github,
                'gitlab', uc.gitlab,
                'bitbucket', uc.bitbucket,
                'slack', uc.slack,
                'angellist', uc.angellist,
                'googleplus', uc.googleplus,
                'stackoverlflow', uc.stackoverlflow,               
                'linkedin', uc.linkedin,
                'quora', uc.quora,
                'reddit', uc.reddit,
                'ycombinator', uc.ycombinator,
                'instagram', uc.instagram,
                'visco', uc.visco,
                'soundcloud', uc.soundcloud
                ) as connections,
                 l.name as userlocation,
                 ul."locationId",
          (select count(*)::int from ${schema}.${USER_FOLLOWERS} uf where uf."userId"=u.id) as totalfollowers,
          (select count(*)::int from ${schema}.${USER_FOLLOWERS} uf where uf."followedBy"=u.id) as totalfollowings
          from ${schema}.${USER} u 
          left join ${schema}.${USER_CONNECTIONS} uc on uc."userId"=u.id
          left join ${schema}.${USER_LOCATION} ul on ul."userId"=u.id
          left join ${schema}.${LOCATION} l on l.id=ul."locationId"
          where u.id=$1`;

    let params = [userid];
    //console.log('sql',sql, params)

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        if (_.isEmpty(result)) throw new Error(`No user profile found!.`);
        let user = result[0];
        return _.omit(user, "emailConfirmationToken", "passwordResetToken");
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Get user connections
   * @param userid
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  getConnections(userid) {
    let { UserConnection } = this.app.orm;

    return UserConnection.findOne({ where: { userId: userid } }).then(
      connections => {
        if (_.isEmpty(connections))
          throw new Error(`No connections detail found!`);
        return connections.toJSON();
      }
    );
  }

  /**
   * Update user basic detail
   * @param fields
   * @param userid
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  update(fields, userid) {
    let { User } = this.app.orm;
    let model = _.omit(fields, "locationId");

    return User.update(model, { where: { id: userid } }).then(rows => {
      return rows;
    });
  }

  /**
   * Insert/Update user location
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  upsertUserLocation(fields) {
    let { UserLocation } = this.app.orm;
    let model = {
      userId: fields.userId,
      locationId: fields.locationId
    };

    return UserLocation.upsert(model).then(rows => {
      return rows;
    });
  }

  /**
   * update user connections
   * @param fields
   * @param userid
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  updateConnections(fields, userid) {
    let { UserConnection } = this.app.orm;

    return UserConnection.update(fields, { where: { userId: userid } }).then(
      rows => {
        return rows;
      }
    );
  }

  /**
   * Add user connetions
   * @param fields
   * @param userid
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  addConnections(fields, userid) {
    let { UserConnection } = this.app.orm;
    let model = _.clone(fields);
    model.userId = userid;

    return UserConnection.create(model).then(data => {
      return data.toJSON();
    });
  }
};
