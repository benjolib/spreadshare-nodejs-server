'use strict'

const Service = require('trails/service')
const passport = require('passport')

/**
 * @module PassportService
 * @description passport service
 */
module.exports = class PassportService extends Service {

  /**
   * Initialize passport strategy
   */
  init() {

    let { User, Passport } = this.app.orm
    let { basic, jwt, facebook, google, twitter } = this.app.config.passport.strategies

    passport.use(new basic.strategy((userid, passwd, done)=> {

      User.findOne({ where: { email: userid }, include: [{ model: Passport }] })
       .then(u=> u && u.toJSON())
       .then(async user=> {
         if(!user) return done(null, false)
         let { password } = user.Passports.find(o=> { return o.protocol=='basic' })||{}
         let isMatch = await this.app.config.passport.bcrypt.compare(passwd, password)
         if(isMatch) {
           done(null, user)
         }
         else {
           done(null, false)
         }
       })
       .catch(e=> { done(e) })
    }));

    passport.use(new jwt.strategy(jwt.options, function(jwt_payload, done) {

      User.findOne({ where: { email: jwt_payload.email }, include: [{ model: Passport }] })
       .then(u=> u && u.toJSON())
       .then(async user=> {
         if(!user) return done(null, false)
         let { password } = user.Passports.find(o=> { return o.protocol=='basic' })||{}
         let isMatch = await this.app.config.passport.bcrypt.compare(passwd, password)
         if(isMatch) {
           done(null, user)
         }
         else {
           done(null, false)
         }
       })
       .catch(e=> { done(e) })
    }));

    passport.use(new facebook.strategy({
       clientID: facebook.options.clientID,
       clientSecret: facebook.options.clientSecret,
       callbackURL: "https://sagar.ngrok.io/api/v1/auth/facebook/callback",
       profileFields: ['id', 'emails', 'name' ]
     },
     (accessToken, refreshToken, profile, cb)=> {

       User.findOne({ where: { email: profile._json.email }, include: [{ model: Passport }] })
        .then(u=> u && u.toJSON())
        .then(async user=> {
          if(!user) {
            user = await User.create({ name: profile._json.first_name, email: profile._json.email })
            await Passport.create({ user_id: user.id, password: '', access_token: accessToken, refresh_token: refreshToken, protocol: 'facebook'})
            cb(null, user)
          }
          else {
            let passport = user.Passports.find(o=> { return o.protocol=='facebook' })
            if(!passport) {
              await Passport.create({ password:'', access_token: accessToken, refresh_token: refreshToken, protocol: 'facebook'})
            }
            else {
              await Passport.update({ access_token: accessToken, refresh_token: refreshToken }, { where: { id: passport.id } })
            }
            cb(null, user)
          }
        })
        .catch(e=> { cb(e) })
     }
    ))

    passport.use(new google.strategy({
       clientID: google.options.clientID,
       clientSecret: google.options.clientSecret,
       callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
     },
     (accessToken, refreshToken, profile, cb)=> {

       User.findOne({ where: { email: profile.emails[0].value }, include: [{ model: Passport }] })
        .then(u=> u && u.toJSON())
        .then(async user=> {
          if(!user) {
            user = await User.create({ name: profile.displayName, email: profile.emails[0].value })
            await Passport.create({ user_id: user.id, password: '', access_token: accessToken, refresh_token: refreshToken, protocol: 'google'})
            cb(null, user)
          }
          else {
            let passport = user.Passports.find(o=> { return o.protocol=='google' })
            if(!passport) {
              await Passport.create({ password:'', access_token: accessToken, refresh_token: refreshToken, protocol: 'google'})
            }
            else {
              await Passport.update({ access_token: accessToken, refresh_token: refreshToken }, { where: { id: passport.id } })
            }
            cb(null, user)
          }
        })
        .catch(e=> { cb(e) })
     }
    ))

    passport.use(new twitter.strategy({
       consumerKey: twitter.options.consumerKey,
       consumerSecret: twitter.options.consumerSecret,
       callbackURL: "http://localhost:3000/api/v1/auth/twitter/callback",
       includeEmail: true
     },
     (accessToken, refreshToken, profile, cb)=> {

       User.findOne({ where: { email: profile.emails[0].value }, include: [{ model: Passport }] })
        .then(u=> u && u.toJSON())
        .then(async user=> {
          if(!user) {
            user = await User.create({ name: profile.displayName, email: profile.emails[0].value })
            await Passport.create({ user_id: user.id, password: '', access_token: accessToken, refresh_token: refreshToken, protocol: 'twitter'})
            cb(null, user)
          }
          else {
            let passport = user.Passports.find(o=> { return o.protocol=='twitter' })
            if(!passport) {
              await Passport.create({ password:'', access_token: accessToken, refresh_token: refreshToken, protocol: 'twitter'})
            }
            else {
              await Passport.update({ access_token: accessToken, refresh_token: refreshToken }, { where: { id: passport.id } })
            }
            cb(null, user)
          }
        })
        .catch(e=> { cb(e) })
     }
    ))

    passport.serializeUser((user, done)=> {
      done(null, user.id)
    });

    passport.deserializeUser((id, done)=> {
      User.findOne({ where: { id } })
       .then(user=> { done(null, user) })
       .catch(e=> { done(e) })
    });
  }
}

