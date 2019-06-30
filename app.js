// incldue packages and setup server variables
const express = require('express')
const app = express()
const bodyPaser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const port = 3000

// setup the app
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(bodyPaser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// connect to local db
mongoose.connect('mongodb://localhost/restaurantListDB', { useNewUrlParser: true })
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
app.use('/users', require('./routes/user.js'))
app.use('/restaurants', require('./routes/restaurant.js'))

// listening on localhost 
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})