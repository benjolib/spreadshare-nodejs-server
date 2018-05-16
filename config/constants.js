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
  vote: {
    TABLE: "table",
    TABLE_ROW: "tablerow",
    TABLE_COMMENT: "tablecomment"
  },
  tables: {
    USER: "user",
    USER_FOLLOWERS: "userfollower",
    USER_CONNECTIONS: "userconnection",
    USER_LOCATION: "userlocation",
    LOCATION: "location",
    TABLE: "table",
    VOTE: "vote"
  }
};
