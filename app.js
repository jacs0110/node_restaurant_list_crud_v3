// incldue packages and setup server variables
const express = require('express')
const app = express()
const bodyPaser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// setup the app
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(flash())

app.use(session({
  secret: 'akpitdx',
  resave: 'false',
  saveUninitialized: 'false'
}))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport.js')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})



// setting static files
app.use(express.static('public'))

// connect to local db
mongoose.connect('mongodb://localhost/restaurantListDB', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

// load models
const restaurantList = require('./models/restaurantList.js')

// routes 
app.use('/', require('./routes/home.js'))
app.use('/auth', require('./routes/auths.js'))
app.use('/users', require('./routes/user.js'))
app.use('/restaurants', require('./routes/restaurant.js'))

// listening on localhost 
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})