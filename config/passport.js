const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const mongoose = require('mongoose')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  // use local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered' })
        }

        // if (user.password !== password) {
        //   return done(null, false, { message: 'Email or password incorrect' })
        // }
        // return done(null, user)
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Email or password incorrect' })
          }
        })
      })
    })
  )

  // use facebook strategy
  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({
        email: profile._json.email
      }).then(user => {
        if (!user) {
          let randomPassword = Math.random().toString(36).slice(-8)

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              let newUser = User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save().then(user => {
                return done(null, user)
              }).catch(err => {
                console.log(err)
              })
            })
          })
        } else {
          return done(null, user)
        }
      })
    })
  )

  // sericalize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}