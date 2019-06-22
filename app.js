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
// Go to index page
app.get('/', (req, res) => {
  restaurantList.find((err, restaurants) => {
    if (err) return console.error(err)
    res.render('index', { restaurants: restaurants })
  })
})

// Go to show page
app.get('/restaurant/:id', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('show', { restaurant: restaurant })
  })
})

// Go to creating a new restaurant page
app.get('/restaurants/new', (req, res) => {
  console.log('create a new item')
  res.render('new')
})

// create a new restaurant
app.post('/restaurants', (req, res) => {
  console.log(req.body)
  const newRestaurant = restaurantList({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })

  newRestaurant.save(err => {
    if (err) console.error(err)
    res.redirect('/')
  })
})

// Go to edit page
app.get('/restaurant/:id/edit', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('edit', { restaurant: restaurant })
  })
})

// Edit a restaurant info
app.post('/restaurant/:id', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description

    restaurant.save(err => {
      if (err) console.error(err)
      res.redirect(`/restaurant/${req.params.id}`)
    })
  })
})

// listening on localhost 
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})