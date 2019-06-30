const mongoose = require('mongoose')
const User = require('../user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/restaurantListDB', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected')

  const userList = [{
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }]

  userList.forEach(element => {

    const { name, email, password } = element

    User.findOne({ email: email }).then(user => {
      if (user) {
        return console.error('Users already exist, no need to run "userSeeder.js" again')
      } else {
        const newUser = new User({
          name,
          email,
          password
        })
        bcrypt.genSalt(10, (err, salt) => {
          let count = 1
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              console.log(`one user added`)
            }).catch(
              err => console.log(err)
            )
            console.log('creating users done')
          })
        })
      }
    })
  })
})