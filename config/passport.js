// config/passport.js
'use strict'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt

const EXPIRES_IN_SECONDS = 60*30
const SECRET             = process.env.tokenSecret || 'jsbot'
const ALGORITHM          = 'HS256'
const ISSUER             = 'localhost'
const AUDIENCE           = 'localhost'

module.exports = {
  redirect              : {
    login : '/',//Login successful
    logout: '/'//Logout successful
  },
  bcrypt                : require('bcryptjs'),
  strategies            : {
    jwt     : {
      strategy    : JwtStrategy,
      tokenOptions: {
        expiresInSeconds: EXPIRES_IN_SECONDS,
        secret          : SECRET,
        algorithm       : ALGORITHM,
        issuer          : ISSUER,
        audience        : AUDIENCE
      },
      options     : {
        secretOrKey   : SECRET,
        issuer        : ISSUER,
        audience      : AUDIENCE,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      }
    },
    basic   : {
      strategy: require('passport-http').BasicStrategy,
      options : {}
    },
    facebook: {
      name    : 'Facebook',
      protocol: 'oauth2',
      strategy: require('passport-facebook').Strategy,
      options : {
        clientID    : process.env.FACEBOOK_CLIENT_ID || '226816748090212',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '07d5d30172a012a463b9f25fbe9a76ea',
        scope       : ['email'] // email is necessary for login behavior
      }
    },
    google  : {
      name    : 'Google',
      protocol: 'oauth2',
      strategy: require('passport-google-oauth20').Strategy,
      options : {
        clientID: process.env.GOOGLE_CLIENT_ID || '775951416441-lvr43pov52cjj0if9qbsua7kb0u00msp.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'wsv-ZpsZBae4rz4KhM11Zac3',
      }
    },
    twitter : {
      name    : 'Twitter',
      protocol: 'oauth',
      strategy: require('passport-twitter').Strategy,
      options : {
        consumerKey   : process.env.TWITTER_CONSUMER_KEY || 'pY7TtQ5icoIyg7sOB5BJDpztB',
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'z6ru8p9FB2S4dh6lLfWsPJAmYBKN7rsHNZx6ZPELsTvlnpXuwd'
      }
    },
  }
}
