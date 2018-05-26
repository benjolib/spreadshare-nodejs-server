/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */

"use strict";

module.exports = [
  /**
   * Render the HelloWorld view
   */
  {
    method: "GET",
    path: "/",
    handler: "ViewController.helloWorld"
  },

  /**
   * Constrain the DefaultController.info handler to accept only GET requests.
   */
  {
    method: ["GET"],
    path: "/api/v1/default/info",
    handler: "DefaultController.info"
  },

  {
    method: "POST",
    path: "/api/v1/auth/signup",
    handler: "AuthController.signup"
  },
  {
    method: "POST",
    path: "/api/v1/auth/login/basic",
    handler: "AuthController.loginBasic"
  },
  {
    method: "POST",
    path: "/api/v1/auth/login/session",
    handler: "AuthController.loginBySession"
  },
  {
    method: "POST",
    path: "/api/v1/auth/login/cookie",
    handler: "AuthController.loginByCookie"
  },
  {
    method: "GET",
    path: "/api/v1/auth/profile",
    handler: "AuthController.profile"
  },
  {
    method: "POST",
    path: "/api/v1/auth/token",
    handler: "AuthController.checkJWT"
  },
  {
    method: "GET",
    path: "/api/v1/auth/logout",
    handler: "AuthController.logout"
  },

  // OAuth2
  {
    method: "GET",
    path: "/api/v1/auth/facebook",
    handler: "AuthController.facebook"
  },
  {
    method: "GET",
    path: "/api/v1/auth/facebook/callback",
    handler: "AuthController.facebookCallback"
  },
  {
    method: "GET",
    path: "/api/v1/auth/google",
    handler: "AuthController.google"
  },
  {
    method: "GET",
    path: "/api/v1/auth/google/callback",
    handler: "AuthController.googleCallback"
  },
  {
    method: "GET",
    path: "/api/v1/auth/twitter",
    handler: "AuthController.twitter"
  },
  {
    method: "GET",
    path: "/api/v1/auth/twitter/callback",
    handler: "AuthController.twitterCallback"
  },

  /**
   * User Controller
   */
  {
    method: "POST",
    path: "/api/v1/user/password/forgot",
    handler: "UserController.forgotPassword"
  },
  {
    method: "POST",
    path: "/api/v1/user/password/reset/:token",
    handler: "UserController.resetPasswordWithToken"
  },
  {
    method: "POST",
    path: "/api/v1/user/change-password",
    handler: "UserController.changePassword"
  },

  /**
   * tags api route
   */

  {
    method: "POST",
    path: "/api/v1/tags/add",
    handler: "TagsController.add"
  },
  {
    method: "GET",
    path: "/api/v1/tags/:id",
    handler: "TagsController.remove"
  },
  {
    method: "POST",
    path: "/api/v1/tags/list",
    handler: "TagsController.list"
  },
  /**
   * subscriber api routes
   */
  {
    method: "POST",
    path: "/api/v1/subscriber/list",
    handler: "SubscriberController.list"
  },
  {
    method: "POST",
    path: "/api/v1/subscriber/subscribe/:id",
    handler: "SubscriberController.subscribe"
  },
  {
    method: "GET",
    path: "/api/v1/subscriber/unsubscribe/:id",
    handler: "SubscriberController.unsubscribe"
  },
  /**
   * table api route
   */
  {
    method: "POST",
    path: "/api/v1/table/create",
    handler: "TableController.create"
  },
  {
    method: "POST",
    path: "/api/v1/table/column",
    handler: "TableController.addColumn"
  },
  {
    method: "POST",
    path: "/api/v1/table/column/addmultiple",
    handler: "TableController.addMultipleColumns"
  },
  {
    method: "PUT",
    path: "/api/v1/table/column/:id",
    handler: "TableController.updateColumn"
  },
  {
    method: "DELETE",
    path: "/api/v1/table/column/:id",
    handler: "TableController.removeColumn"
  },
  {
    method: "PUT",
    path: "/api/v1/table/update/:id",
    handler: "TableController.update"
  },
  {
    method: "PUT",
    path: "/api/v1/table/publish/:id",
    handler: "TableController.publish"
  },
  {
    method: "GET",
    path: "/api/v1/table/:id",
    handler: "TableController.tableDetail"
  },
  {
    method: "POST",
    path: "/api/v1/table/contents/:id",
    handler: "TableController.tableData"
  },
  {
    method: "DELETE",
    path: "/api/v1/table/:id",
    handler: "TableController.remove"
  },
  {
    method: "POST",
    path: "/api/v1/table/list",
    handler: "TableController.list"
  },
  {
    method: "POST",
    path: "/api/v1/table/row",
    handler: "TableController.addRow"
  },
  {
    method: "POST",
    path: "/api/v1/table/row/remove",
    handler: "TableController.deleteTableRow"
  },
  {
    method: "PUT",
    path: "/api/v1/table/row",
    handler: "TableController.updateTableRow"
  },
  {
    method: "POST",
    path: "/api/v1/table/history",
    handler: "TableController.historyList"
  },
  /**
   * Collaboration apis
   */
  {
    method: "GET",
    path: "/api/v1/collaborate/revoke/:rowid",
    handler: "CollaborationController.revokeSubmission"
  },
  {
    method: "POST",
    path: "/api/v1/collaborate/list",
    handler: "CollaborationController.list"
  },

  /**
   *   Vote api route
   */

  {
    method: "POST",
    path: "/api/v1/vote",
    handler: "VoteController.addVote"
  },
  {
    method: "POST",
    path: "/api/v1/vote/remove",
    handler: "VoteController.removeVote"
  },

  /**
   * ProfileController
   */
  {
    method: "GET",
    path: "/api/v1/profile",
    handler: "ProfileController.getProfile"
  },
  {
    method: "PUT",
    path: "/api/v1/profile",
    handler: "ProfileController.updateProfile"
  },
  {
    method: "PUT",
    path: "/api/v1/profile/userconnection",
    handler: "ProfileController.upsertConnections"
  },
  {
    method: "GET",
    path: "/api/v1/profile/userconnection/:userid",
    handler: "ProfileController.getUserConnections"
  },
  {
    method: "POST",
    path: "/api/v1/profile/upload",
    handler: "ProfileController.uploadImage"
  },

  /**
   * Notification api route
   */

  {
    method: "GET",
    path: "/api/v1/notification/:id",
    handler: "NotificationController.get"
  },
  {
    method: "POST",
    path: "/api/v1/notification/read",
    handler: "NotificationController.read"
  },
  {
    method: "POST",
    path: "/api/v1/notification",
    handler: "NotificationController.list"
  },

  /**
   * curator api
   */
  {
    method: "GET",
    path: "/api/v1/curator/follow/:id",
    handler: "CuratorController.follow"
  },
  {
    method: "DELETE",
    path: "/api/v1/curator/unfollow/:id",
    handler: "CuratorController.unfollow"
  },
  {
    method: "POST",
    path: "/api/v1/curator/list",
    handler: "CuratorController.list"
  },

  /**
   * Comment api route
   */
  {
    method: "POST",
    path: "/api/v1/table/comment/:id",
    handler: "CommentController.add"
  },
  {
    method: "DELETE",
    path: "/api/v1/table/comment/:id",
    handler: "CommentController.remove"
  },
  {
    method: "POST",
    path: "/api/v1/table/comment/list",
    handler: "CommentController.list"
  },

  /**
   * Search apis
   */
  {
    method: "POST",
    path: "/api/v1/search/list",
    handler: "SearchController.list"
  },
  {
    method: "PUT",
    path: "/api/v1/table/updatestatus/:id",
    handler: "TableController.updateStatus"
  },
  {
    method: "POST",
    path: "/api/v1/search/feed",
    handler: "SearchController.getFeed"
  },
  {
    method: "GET",
    path: "/api/v1/search/feed/count",
    handler: "SearchController.getFeedUnreadCount"
  },
  /**
   * user Api routes
   */

  {
    method: "POST",
    path: "/api/v1/user/history",
    handler: "UserController.history"
  },
  {
    method: "POST",
    path: "/api/v1/user/statistic",
    handler: "UserController.statistic"
  },
  {
    method: "POST",
    path: "/api/v1/user/publication",
    handler: "UserController.publication"
  }
];
