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
    handler: "AuthController.signup",
    config: { id: "AuthValidator.signup" }
  },
  {
    method: "POST",
    path: "/api/v1/auth/login/basic",
    handler: "AuthController.loginBasic",
    config: { id: "AuthValidator.triggerSession" }
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
    handler: "UserController.forgotPassword",
    config: { id: "ProfileValidator.forgotPassword" }
  },
  {
    method: "POST",
    path: "/api/v1/user/password/reset/:token",
    handler: "UserController.resetPasswordWithToken",
    config: { id: "ProfileValidator.resetPassword" }
  },
  {
    method: "POST",
    path: "/api/v1/user/change-password",
    handler: "UserController.changePassword",
    config: { id: "ProfileValidator.changePassword" }
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
    handler: "ProfileController.updateProfile",
    config: { id: "ProfileValidator.updateProfile" }
  },
  {
    method: "PUT",
    path: "/api/v1/profile/userconnection",
    handler: "ProfileController.upsertConnections",
    config: { id: "ProfileValidator.upsertConnections" }
  },
  {
    method: "GET",
    path: "/api/v1/profile/userconnection/:userid",
    handler: "ProfileController.getUserConnections"
  },
  {
    method: "POST",
    path: "/api/v1/profile/upload",
    handler: "ProfileController.uploadImage",
    config: { id: "ProfileValidator.uploadImage" }
  },

  //tags api route
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
    handler: "SubscriberController.list",
    config: { id: "SubscriberValidator.list" }
  },
  {
    method: "POST",
    path: "/api/v1/subscriber/subscribe",
    handler: "SubscriberController.subscribe",
    config: { id: "SubscriberValidator.subscribe" }
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
    handler: "TableController.create",
    config: { id: "TableValidator.create" }
  },
  {
    method: "POST",
    path: "/api/v1/table/column",
    handler: "TableController.addColumn",
    config: { id: "TableValidator.addColumn" }
  },
  {
    method: "POST",
    path: "/api/v1/table/column/addmultiple",
    handler: "TableController.addMultipleColumns",
    config: { id: "TableValidator.addMultipleColumns" }
  },
  {
    method: "PUT",
    path: "/api/v1/table/column/:id",
    handler: "TableController.updateColumn",
    config: { id: "TableValidator.addColumn" }
  },
  {
    method: "DELETE",
    path: "/api/v1/table/column/:id",
    handler: "TableController.removeColumn"
  },
  {
    method: "PUT",
    path: "/api/v1/table/update/:id",
    handler: "TableController.update",
    config: { id: "TableValidator.create" }
  },
  {
    method: "PUT",
    path: "/api/v1/table/publish/:id",
    handler: "TableController.publish",
    config: { id: "TableValidator.publish" }
  },
  {
    method: "GET",
    path: "/api/v1/table/:id",
    handler: "TableController.tableDetail",
    config: { id: "TableValidator.updateTableRow" }
  },
  {
    method: "POST",
    path: "/api/v1/table/contents/:id",
    handler: "TableController.tableData",
    config: { id: "TableValidator.getTableContentList" }
  },
  {
    method: "DELETE",
    path: "/api/v1/table/:id",
    handler: "TableController.remove"
  },
  {
    method: "POST",
    path: "/api/v1/table/list",
    handler: "TableController.list",
    config: { id: "TableValidator.list" }
  },
  {
    method: "POST",
    path: "/api/v1/table/row",
    handler: "TableController.addRow",
    config: { id: "TableValidator.addRow" }
  },
  {
    method: "POST",
    path: "/api/v1/table/row/remove",
    handler: "TableController.deleteTableRow",
    config: { id: "TableValidator.deleteTableRow" }
  },
  {
    method: "PUT",
    path: "/api/v1/table/row",
    handler: "TableController.updateTableRow",
    config: { id: "TableValidator.updateTableRow" }
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
    handler: "CollaborationController.list",
    config: { id: "TableValidator.getCollaborateList" }
  },

  //tags api route
  {
    method: "POST",
    path: "/api/v1/vote",
    handler: "VoteController.addVote",
    config: { id: "VoteValidator.create" }
  },
  {
    method: "POST",
    path: "/api/v1/vote/remove",
    handler: "VoteController.removeVote",
    config: { id: "VoteValidator.create" }
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
    handler: "ProfileController.updateProfile",
    config: { id: "ProfileValidator.updateProfile" }
  },
  {
    method: "PUT",
    path: "/api/v1/profile/userconnection",
    handler: "ProfileController.upsertConnections",
    config: { id: "ProfileValidator.upsertConnections" }
  },
  {
    method: "GET",
    path: "/api/v1/profile/userconnection/:userid",
    handler: "ProfileController.getUserConnections"
  },
  {
    method: "POST",
    path: "/api/v1/profile/upload",
    handler: "ProfileController.uploadImage",
    config: { id: "ProfileValidator.uploadImage" }
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
    method: "PUT",
    path: "/api/v1/notification/:id",
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
    method: "POST",
    path: "/api/v1/curator/follow",
    handler: "CuratorController.follow",
    config: { id: "CuratorValidator.follow" }
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
    path: "/api/v1/table/comment",
    handler: "CommentController.add",
    config: { id: "CommentValidator.add" }
  },
  {
    method: "DELETE",
    path: "/api/v1/table/comment/:id",
    handler: "CommentController.remove"
  },
  {
    method: "POST",
    path: "/api/v1/table/comment/list",
    handler: "CommentController.list",
    config: { id: "CommentValidator.list" }
  },

  /**
   * Search apis
   */
  {
    method: "POST",
    path: "/api/v1/search/list",
    handler: "SearchController.list",
    config: { id: "TableValidator.search" }
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
  }
];
