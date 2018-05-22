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
    TAGS: "tags"
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
  }
};
