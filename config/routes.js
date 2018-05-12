/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */

'use strict'

module.exports = [

  /**
   * Render the HelloWorld view
   */
  {
    method: 'GET',
    path: '/',
    handler: 'ViewController.helloWorld'
  },

  /**
   * Constrain the DefaultController.info handler to accept only GET requests.
   */
  {
    method: [ 'GET' ],
    path: '/api/v1/default/info',
    handler: 'DefaultController.info'
  },

  {
    method: 'POST',
    path: '/api/v1/auth/signup',
    handler: 'AuthController.signup',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login/basic',
    handler: 'AuthController.loginBasic',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login/session',
    handler: 'AuthController.loginBySession',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login/cookie',
    handler: 'AuthController.loginByCookie',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/profile',
    handler: 'AuthController.profile',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/token',
    handler: 'AuthController.checkJWT',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/logout',
    handler: 'AuthController.logout'
  },

 // OAuth2
  {
    method: 'GET',
    path: '/api/v1/auth/facebook',
    handler: 'AuthController.facebook',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/facebook/callback',
    handler: 'AuthController.facebookCallback',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/google',
    handler: 'AuthController.google',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/google/callback',
    handler: 'AuthController.googleCallback',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/twitter',
    handler: 'AuthController.twitter',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/twitter/callback',
    handler: 'AuthController.twitterCallback',
  },
]