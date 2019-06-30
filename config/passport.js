const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const User = require('../models/user.js')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered' })
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Email or password incorrect' })
        }
        return done(null, user)
      })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}