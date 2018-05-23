"use strict";

const Service = require("trails/service");
const _ = require("lodash");
const moment = require("moment");

/**
 * @module FeedService
 * @description feed related apis
 */
module.exports = class FeedService extends Service {
  /**
   * get last view for user
   * @param fields
   * @returns {Promise<T>}
   */
  getLastView(fields) {
    let { FeedView } = this.app.orm;

    return FeedView.findOne({ where: { userId: fields.userId } }).then(data => {
      if (_.isEmpty(data)) throw new Error(`No last view entry found!`);
      return data.toJSON();
    });
  }

  /**
   *
   * @param fields
   * @returns {Promise<T>}
   */
  updateLastView(fields) {
    let { FeedView } = this.app.orm;
    let time = moment().format();

    //Check LastView exists If exist update it otherwise make new entry for it
    if (fields.lastviewid) {
      return FeedView.update(
        { lastView: time },
        { where: { id: fields.lastviewid } }
      ).then(data => {
        return data;
      });
    } else {
      return FeedView.create({ userId: fields.userId, lastView: time }).then(
        data => {
          return data.toJSON();
        }
      );
    }
  }

  /**
   * Get user feed detail
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  findFeed(fields) {
    let { sequelize } = this.app.orm.FeedAction;
    let { schema } = sequelize.options;
    let { feedStatus } = this.app.config.constants;
    let {
      USER,
      USER_FOLLOWER,
      TABLE,
      TABLE_SUBSCRIPTION,
      FEED_ACTION
    } = this.app.config.constants.tables;

    let params = [];
    let lastView = fields.lastview;
    let recentView = fields.recentview;
    let condSql = ``;

    params.push(fields.userid);

    let start = parseInt(fields.start) || 0;
    let limit = parseInt(fields.limit) || 10;

    condSql = `(select case when "userId">0 then true else false end from ${schema}.${USER_FOLLOWER} uf
               where uf."userId" in(select owner from ${schema}."${TABLE}" where id=f."tableId") 
               and "followedBy"=$1)
               or
              (select case when "userId">0 then true else false end from ${schema}."${TABLE_SUBSCRIPTION}" ts
               where "userId"=$1 
               and ts."tableId"=f."tableId"))
               AND f.status='${feedStatus.APPROVED}'`;

    if (recentView) {
      console.log(`recentView`, recentView);
      recentView = moment(recentView).format();
      condSql = `${condSql} AND f."createdAt"<'${recentView}'`;
    } else if (lastView) {
      console.log(`lastView`, lastView);
      lastView = moment(lastView).format();
      condSql = `${condSql}  AND f."createdAt">'${lastView}'`;
    }

    let sql = `with feed as (select f.*,u.name,u.image from ${schema}.${FEED_ACTION} f
               JOIN  ${schema}.${USER} u ON u.id=f."userId"
               where ( ${condSql} OFFSET ${start} limit ${limit})
                select * from feed ORDER by "updatedAt" desc; `;

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(feed => {
        if (_.isEmpty(feed)) throw new Error("No feeds found!");

        return feed;
      });
  }

  /**
   * Get user feed unread count
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  findFeedUnreadCountLastRecentView(fields) {
    let { sequelize } = this.app.orm.FeedAction;
    let { schema } = sequelize.options;
    let {
      USER_FOLLOWER,
      TABLE,
      TABLE_SUBSCRIPTION,
      FEED_ACTION
    } = this.app.config.constants.tables;

    let params = [];
    let lastView = fields.lastview;
    let condSql = ``,
      countSql = ``,
      recentViewSql = ``;

    params.push(fields.userid);

    condSql = `(select case when "userId">0 then true else false end from ${schema}.${USER_FOLLOWER} uf
               where uf."userId" in(select owner from ${schema}."${TABLE}" where id=f."tableId") 
               and "followedBy"=$1)
               or
              (select case when "userId">0 then true else false end from ${schema}."${TABLE_SUBSCRIPTION}" ts
               where "userId"=$1 
               and ts."tableId"=f."tableId"))`;

    if (lastView) {
      console.log(`lastView`, lastView);
      lastView = moment(lastView).format();
      condSql = ` ${condSql} AND f."createdAt">'${lastView}'`;
    }

    if (fields.iscount) countSql = `select count(*)::int as count from feed`;
    else
      recentViewSql = `select "createdAt" from feed order by "createdAt" desc limit 1`;

    let sql = `with feed as (select * from ${schema}.${FEED_ACTION} f
               where ( ${condSql}) ${countSql} ${recentViewSql}`;

    return sequelize
      .query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT
      })
      .then(data => {
        if (_.isEmpty(data)) throw new Error(`No feed detail found!`);

        return data && data.length ? data[0] : {};
      });
  }

  /**
   * Get table feeds
   * @param fields
   * @returns {Promise<T>}
   */
  findTableFeed(fields) {
    let { sequelize } = this.app.orm.Table;
    let { votesType } = this.app.config.constants;
    let { TABLE, VOTE } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``,
      whereCond = ``,
      voteSql = ``;

    voteSql = `(SELECT count(*)::int from ${schema}.${VOTE} where "itemId"=t.id AND "type"='${
      votesType.TABLE
    }') as votes`;

    whereCond = ` AND t."isPublished"=true`;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    sql = `select t.*,                 
                 ${voteSql}  
                from ${schema}."${TABLE}" t                
                where t."id"=ANY('{${
                  fields.tableIds
                }}') ${whereCond}               
                order by t."createdAt" asc
                ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`No lists found`);
        return rows;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Get table row  feeds
   * @param fields
   * @returns {Promise<T>}
   */
  findTableContentFeed(fields) {
    let { sequelize } = this.app.orm.Table;
    let { votesType, rowStatusType } = this.app.config.constants;
    let {
      TABLE_CELL,
      TABLE,
      TABLE_ROW,
      TABLE_COLUMN,
      VOTE
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``,
      whereCond = ``,
      voteSql = ``;

    voteSql = `(SELECT count(*)::int from ${schema}.${VOTE} where "itemId"=tr.id AND "type"='${
      votesType.TABLE_ROW
    }') as votes`;

    fields.status = fields.status || rowStatusType.APPROVED;

    if (fields.status) whereCond = ` AND status='${fields.status}'`;

    whereCond = ` AND t."isPublished"=true`;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    sql = `select tr.*,t.title,
                 json_agg(json_build_object('columnId', trc."columnId", 'content' , trc.content, 'link' , trc.link)) as cells,                 
                 ${voteSql}  
                from ${schema}."${TABLE}" t 
                join ${schema}."${TABLE_COLUMN}" tc on tc."tableId"=t.id
                join ${schema}."${TABLE_ROW}" tr on tr."tableId"=t.id 
                join ${schema}."${TABLE_CELL}" trc on trc."rowId" =tr.id 
                where tr."id"=ANY('{${fields.tableRowIds}}') ${whereCond}
                group by tr.id,t.title
                order by tr."createdAt" asc
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
};
