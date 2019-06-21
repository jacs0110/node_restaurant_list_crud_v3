// incldue packages and setup server variables
const express = require('express')
const app = express()
const bodyPaser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const port = 3000

// set up view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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

// setup body-parser
app.use(bodyPaser.urlencoded({ extended: true }))

// routes
app.get('/', (req, res) => {
  restaurantList.find((err, restaurants) => {
    if (err) return console.error(err)
    res.render('index', { restaurants: restaurants })
  })
})

app.get('/show/:id', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('show', { restaurant: restaurant })
  })
})

// listening on localhost 
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})