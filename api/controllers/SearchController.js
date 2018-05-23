"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
const moment = require("moment");
const async = require("async");

/**
 * @module SearchController
 * @description search &amp; feed apis.
 */
module.exports = class SearchController extends Controller {
  /**
   * Get tables list by search
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let { TableService } = this.app.services;
    let { tableSortType } = this.app.config.constants;
    let body = req.body;
    let defaultSort = {};
    defaultSort[tableSortType.SPREADS] = "desc";

    let sort = body.sort && !_.isEmpty(body.sort) ? body.sort : defaultSort;
    let sortKey = Object.keys(sort)[0];

    let model = {
      start: body.start,
      limit: body.limit,
      sort: sortKey,
      order: sort[sortKey],
      isPublished: true,
      term: body.term
    };

    try {
      let table = await TableService.findPopular(model);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Get feed
   * @param req
   * @param res
   */
  getFeed(req, res) {
    let { FeedService } = this.app.services;
    let { feedItemType } = this.app.config.constants;

    let model = req.body;
    let user = req.user; //get login user
    let reqUserId = user.id,
      lastView = null,
      recentView = null,
      lastviewId;
    let mainFeeds = [],
      responseFeeds = [];
    let unreadCount = 0;

    let start = parseInt(model.start) || 0;
    let limit = parseInt(model.limit) || 10;

    async.waterfall(
      [
        //Get last view for user
        cb => {
          if (model.recentview) {
            recentView = model.recentview;
            //return cb()
          }

          async.series(
            [
              //Get last feed view
              cb => {
                FeedService.getLastView({ userId: reqUserId })
                  .then(data => {
                    lastView = data.lastView;
                    lastviewId = data.id;
                    cb();
                  })
                  .catch(err => {
                    cb();
                  });
              },
              //Get unreadcount
              cb => {
                let condition = {
                  userid: reqUserId,
                  lastview: lastView,
                  start,
                  limit,
                  iscount: true
                };

                FeedService.findFeedUnreadCountLastRecentView(condition)
                  .then(data => {
                    unreadCount = data.count;
                    cb();
                  })
                  .catch(err => {
                    cb();
                  });
              }
            ],
            (err, data) => {
              if (unreadCount || model.recentview) return cb();

              FeedService.findFeedUnreadCountLastRecentView({
                userid: reqUserId,
                start,
                limit
              })
                .then(data => {
                  recentView = moment(data.createdAt)
                    .add(1, "seconds")
                    .format();
                  cb();
                })
                .catch(err => {
                  cb();
                });
            }
          );
        },
        //Get feeds
        cb => {
          let condition = {
            userid: reqUserId,
            lastview: lastView,
            recentview: recentView,
            start,
            limit
          };

          FeedService.findFeed(condition)
            .then(feeds => {
              mainFeeds = feeds;
              cb(null, feeds);
            })
            .catch(err => {
              cb(err);
            });
        },
        //Get feed content data -> table|tableRow
        (feeds, cb) => {
          let allTables = _.filter(feeds, { itemType: feedItemType.TABLE });
          let allTablesRow = _.filter(feeds, {
            itemType: feedItemType.TABLE_ROW
          });

          let feedContents = { tables: [], tableRows: [] };

          async.parallel(
            [
              // Get tables
              cb => {
                FeedService.findTableFeed({
                  tableIds: _.map(allTables, "itemId")
                })
                  .then(tables => {
                    feedContents.tables = tables;
                    cb();
                  })
                  .catch(e => {
                    cb();
                  });
              },
              //Get tables rows
              cb => {
                FeedService.findTableContentFeed({
                  tableRowIds: _.map(allTablesRow, "itemId")
                })
                  .then(tableRows => {
                    feedContents.tableRows = tableRows;
                    cb();
                  })
                  .catch(e => {
                    cb();
                  });
              }
            ],
            (err, data) => {
              // console.log(`feedContents`,feedContents)

              _.map(feeds, f => {
                if (f.itemType == feedItemType.TABLE) {
                  f.data = _.find(feedContents.tables, {
                    id: parseInt(f.itemId)
                  });
                } else {
                  f.data = _.find(feedContents.tableRows, {
                    id: parseInt(f.itemId)
                  });
                }
              });
              cb(null, feeds);
            }
          );
        }
      ],
      (err, data) => {
        if (err)
          return res.json({
            flag: false,
            message: err.message,
            errorcode: `NoFeeds`
          });

        res.json({
          flag: true,
          data: {
            feeds: data,
            unreadcount: unreadCount,
            recentview: recentView,
            lastview: lastView
          }
        });

        //Update user lastView
        FeedService.updateLastView({ userId: user.id, lastviewid: lastviewId })
          .then(data => {
            console.log(`last view`, data);
          })
          .catch(err => {
            console.log(`last view not updated `);
          });
      }
    );
  }

  /**
   * Get unread count for feed
   * @param req
   * @param res
   */
  getFeedUnreadCount(req, res) {
    let { FeedService } = this.app.services;

    let user = req.user; //get login user
    let reqUserId = user.id,
      lastView = null,
      lastviewId;
    let unreadCount = 0;

    async.series(
      [
        //Get last feed view
        cb => {
          FeedService.getLastView({ userId: reqUserId })
            .then(data => {
              lastView = data.lastView;
              lastviewId = data.id;
              cb();
            })
            .catch(err => {
              cb();
            });
        },
        //Get unreadcount
        cb => {
          let condition = {
            userid: reqUserId,
            lastview: lastView,
            iscount: true
          };

          FeedService.findFeedUnreadCountLastRecentView(condition)
            .then(data => {
              unreadCount = data.count;
              cb();
            })
            .catch(err => {
              cb();
            });
        }
      ],
      (err, data) => {
        return res.json({ flag: true, data: unreadCount });
      }
    );
  }
};
