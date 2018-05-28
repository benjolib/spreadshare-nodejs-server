/**
 * Constants
 */

"use strict";

module.exports = {
  user: {
    type: {
      FOLLOWER: "F",
      COLLABORATIONS: "COL",
      SUBMISSIONS: "S",
      COMMENTS: "COM",
      NEW_LISTS: "N",
      SUMMARY: "S",
      UPDATES: "U"
    },
    status: {
      ACTIVE: "A",
      DEACTIVE: "D"
    }
  },
  tables: {
    TABLE: "table",
    TABLE_VIEW: "tableview",
    TABLE_ROW: "tablerow",
    TABLE_COLUMN: "tablecolumn",
    USER: "user",
    TABLE_SUBSCRIPTION: "tablesubscription",
    TABLE_INFO: "tableinfo",
    VOTE: "vote",
    TABLE_CELL: "tablecells",
    TAGS: "tags",
    USER_FOLLOWERS: "userfollower",
    USER_CONNECTIONS: "userconnection",
    USER_LOCATION: "userlocation",
    LOCATION: "location",
    USER_FOLLOWER: "userfollower",
    USER_NOTIFICATION: "usernotification",
    FEED_ACTION: "feedaction",
    READ_NOTIFICATION: "readnotification"
  },
  tableSortType: {
    SPREADS: "totalSpread",
    SUBSCRIBERS: "totalSubscribers",
    COLLABORATIONS: "totalCollaborations",
    VIEWS: "totalView",
    CREATED_AT: "createdAt"
  },
  tableRowActionType: {
    SUBMITTED: "submitted",
    DELETED: "deleted",
    UPDATED: "updated"
  },
  rowStatusType: {
    PENDING: "P",
    APPROVED: "A",
    REJECTED: "R",
    REVOKED: "RE"
  },
  collaborateTypes: {
    SUBMITTED: "submitted",
    RECEIVED: "received"
  },
  votesType: {
    TABLE: "table",
    TABLE_ROW: "tablerow",
    TABLE_COMMENT: "tablecomment"
  },
  vote: {
    TABLE: "table",
    TABLE_ROW: "tablerow",
    TABLE_COMMENT: "tablecomment"
  },
  resetPasswordStatusType: {
    PENDING: "P",
    ACCESSED: "A"
  },
  notificationType: {
    FOLLOW: "F",
    SUBSCRIBE: "S",
    COLLABORATE: "C",
    COLLABORATE_UPDATE_STATUS: "CUS",
    COMMENTS: "COM",
    NEW_LIST: "NL"
  },
  subscribeType: {
    SUBSCRIBE: "S"
  },
  notificationItemType: {
    TABLE: "table",
    TABLE_ROW: "tablerow",
    TABLE_COLUMN: "tablecolumn"
  },
  feedItemType: {
    TABLE: "table",
    TABLE_ROW: "tablerow"
  },
  feedStatus: {
    PENDING: "P",
    APPROVED: "A"
  }
};
