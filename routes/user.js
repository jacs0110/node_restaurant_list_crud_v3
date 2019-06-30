const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')


// login
router.get('/login', (req, res) => {
  res.render('login')
})

// login check
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})

// register
router.get('/register', (req, res) => {
  res.render('register')
})

// register check
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'All fields are required' })
  }

  // if (password !== password2) {
  //   errors.push({ message: 'Passwords are not consistent' })
  // }


  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        console.log('User already exist!')
        errors.push({ message: 'This email has been registered' })
        console.log(errors)
        res.render('register', {
          name,
          email,
          password,
          password2,
          errors
        })
      } else if (password !== password2) {
        errors.push({ message: 'Passwords are not consistent' })
        res.render('register', {
          name,
          email,
          password,
          password2,
          errors
        })
      } else if (password === password2) {
        const newUser = new User({
          name,
          email,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              res.redirect('/')
            }).catch(
              err => console.log(err)
            )
          })
        })
      }
    })
  }

})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logout successfully')
  res.redirect('/users/login')
})

module.exports = router