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
      DEACTIVE: "D",
      SUBSCRIBE: "S",
      UNSUBSCRIBE: "U"
    }
  },
  tables: {
    TABLE: "table",
    USER: "user",
    TABLEVIEW: "tableview",
    TABLE_SUBSCRIPTION: "tablesubscription"
  },
  tableSortType: {
    CREATED_AT: "createdat"
  }
};
