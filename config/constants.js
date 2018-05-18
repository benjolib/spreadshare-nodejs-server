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
    USER: "user",
    TABLE_SUBSCRIPTION: "tablesubscription",
    TABLE_INFO: "tableinfo",
    VOTE: "vote",
    TABLE_CELL: "tablecells",
    TABLE_COLUMN: "tablecolumn"
  },
  tableSortType: {
    SPREADS: "totalSpread",
    SUBSCRIBERS: "totalSubscribers",
    COLLABORATIONS: "totalCollaborations",
    VIEWS: "totalView",
    CREATED_AT: "createdAt"
  },
  status: {
    APPROVED: "A"
  }
};
