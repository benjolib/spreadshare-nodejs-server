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
    handler: "SubscriberController.list"
  },

  //Votes api route
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
    handler: "TableController.tableDetail"
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
    method: "DELETE",
    path: "/api/v1/table/row/:id",
    handler: "TableController.deleteTableRow"
  },
  {
    method: "PUT",
    path: "/api/v1/table/row/:id",
    handler: "TableController.updateTableRow"
  },
  {
    method: "POST",
    path: "/api/v1/table/history",
    handler: "TableController.historyList"
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
  }
];
