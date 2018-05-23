/**
 * Policies Configuration
 * (app.config.footprints)
 *
 * Define which prerequisites a request must pass before reaching the intended
 * controller action. By default, no policies are configured for controllers or
 * footprints, therefore the request always will directly reach the intended
 * handler.
 *
 * @see http://trailsjs.io/doc/config/policies
 */

"use strict";

module.exports = {
  DefaultController: {
    info: []
  },

  AuthController: {
    signup: ["JoiPolicy.validate"],
    loginBasic: ["PassportPolicy.basic"],
    checkJWT: ["PassportPolicy.jwt"],
    profile: ["PassportPolicy.authenticate"],
    facebook: ["PassportPolicy.facebook"],
    facebookCallback: ["PassportPolicy.facebook"],
    google: ["PassportPolicy.google"],
    googleCallback: ["PassportPolicy.google"],
    twitter: ["PassportPolicy.twitter"],
    twitterCallback: ["PassportPolicy.twitter"]
  },
  TableController: {
    create: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    addColumn: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    addMultipleColumns: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    updateColumn: ["JoiPolicy.validate"],
    update: ["JoiPolicy.validate"],
    publish: ["JoiPolicy.validate"],
    list: ["JoiPolicy.validate"],
    addRow: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    updateStatus: ["PassportPolicy.authenticate", "AuthPoilcy.loadTableRow"],
    deleteTableRow: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ],
    updateTableRow: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable",
      "AuthPoilcy.loadCells"
    ],
    tableData: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ]
  },

  CollaborationController: {
    revokeSubmission: [
      "PassportPolicy.authenticate",
      "AuthPoilcy.loadTableRow"
    ],
    list: ["PassportPolicy.authenticate", "JoiPolicy.validate"]
  },
  UserController: {
    history: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    statistic: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    forgotPassword: ["JoiPolicy.validate"],
    resetPasswordWithToken: ["JoiPolicy.validate"],
    changePassword: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    publication: ["PassportPolicy.authenticate", "JoiPolicy.validate"]
  },

  VoteController: {
    addVote: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    removeVote: ["PassportPolicy.authenticate", "JoiPolicy.validate"]
  },
  SubscriberController: {
    subscribe: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ],
    list: ["JoiPolicy.validate"]
  },
  ProfileController: {
    getProfile: ["PassportPolicy.authenticate"],
    updateProfile: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    upsertConnections: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    uploadImage: ["PassportPolicy.authenticate", "JoiPolicy.validate"]
  },
  NotificationController: {
    list: ["PassportPolicy.authenticate"],
    read: ["PassportPolicy.authenticate"],
    get: ["PassportPolicy.authenticate"]
  },
  CuratorController: {
    follow: ["PassportPolicy.authenticate"],
    unfollow: ["PassportPolicy.authenticate"],
    list: ["PassportPolicy.authenticate", "JoiPolicy.validate"]
  },
  CommentController: {
    add: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ],
    remove: ["PassportPolicy.authenticate"],
    list: ["JoiPolicy.validate", "JoiPolicy.validate"]
  },
  SearchController: {
    list: ["JoiPolicy.validate", "JoiPolicy.validate"]
  },
  TagsController: {
    list: ["JoiPolicy.validate"],
    add: ["JoiPolicy.validate"]
  }
};
