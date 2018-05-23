// config/validators.js
"use strict";

module.exports = {
  AuthController: {
    signup: "AuthValidator.signup",
    loginBasic: "AuthValidator.triggerSession"
  },
  TableController: {
    create: "TableValidator.create",
    addColumn: "TableValidator.addColumn",
    addMultipleColumns: "TableValidator.addMultipleColumns",
    updateColumn: "TableValidator.addColumn",
    update: "TableValidator.create",
    publish: "TableValidator.publish",
    list: "TableValidator.list",
    addRow: "TableValidator.addRow",
    deleteTableRow: "TableValidator.deleteTableRow",
    updateTableRow: "TableValidator.updateTableRow",
    tableData: "TableValidator.getTableContentList",
    updateStatus: "TableValidator.updateStatus",
    historyList: "TableValidator.historyList"
  },

  CollaborationController: {
    list: "TableValidator.getCollaborateList"
  },
  UserController: {
    forgotPassword: "ProfileValidator.forgotPassword",
    resetPasswordWithToken: "ProfileValidator.resetPassword",
    changePassword: "ProfileValidator.changePassword",
    history: "ProfileValidator.history",
    statistic: "ProfileValidator.statistic",
    publication: "ProfileValidator.statistic"
  },

  VoteController: {
    addVote: "VoteValidator.create",
    removeVote: "VoteValidator.create"
  },
  SubscriberController: {
    subscribe: "SubscriberValidator.subscribe",
    list: "SubscriberValidator.list"
  },
  ProfileController: {
    updateProfile: "ProfileValidator.updateProfile",
    upsertConnections: "ProfileValidator.upsertConnections",
    uploadImage: "ProfileValidator.uploadImage"
  },
  CuratorController: {
    list: "CuratorValidator.list"
  },
  CommentController: {
    add: "CommentValidator.add",
    list: "CommentValidator.list"
  },
  SearchController: {
    list: "TableValidator.search"
  },
  NotificationController: {
    list: "NotificationValidator.list"
  },
  TagsController: {
    list: "TagsValidator.list",
    add: "TagsValidator.add"
  }
};
