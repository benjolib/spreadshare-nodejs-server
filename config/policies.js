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
    updateColumn: ["JoiPolicy.validate"],
    update: ["JoiPolicy.validate"],
    publish: ["JoiPolicy.validate"],
    list: ["JoiPolicy.validate"],
    addRow: ["PassportPolicy.authenticate", "JoiPolicy.validate"],
    deleteTableRow: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ],
    updateTableRow: [
      "PassportPolicy.authenticate",
      "JoiPolicy.validate",
      "AuthPoilcy.checkTable"
    ]
  }
};
