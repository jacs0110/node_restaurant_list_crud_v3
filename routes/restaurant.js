const express = require('express')
const router = express.Router()
const restaurantList = require('../models/restaurantList.js')

// routes
// Go to index page
router.get('/', (req, res) => {
  restaurantList.find((err, restaurants) => {
    if (err) return console.error(err)
    let result = []
    restaurants.forEach(e => {
      result.push(e.category)
    })
    categories = [...new Set(result)]
    console.log(categories)
    res.render('index', { restaurants: restaurants, categories: categories })
  })
})

// Go to creating a new restaurant page
router.get('/new', (req, res) => {
  console.log('create a new item')
  res.render('new')
})

// search function
router.get('/search', (req, res) => {
  restaurantList.find((err, restaurants) => {
    const keyword = req.query.keyword
    if (err) return console.error(err)
    const restaurantResults = restaurants.filter(({ name, category }) => {
      return (category.toLowerCase().includes(keyword.toLowerCase()) || name.toLowerCase().includes(keyword.toLowerCase()))
    })
    res.render('index', { restaurants: restaurantResults, keyword: keyword })
  })
})

// Go to show page
router.get('/:id', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('show', { restaurant: restaurant })
  })
})

// create a new restaurant
router.post('/', (req, res) => {
  // console.log(req.body)
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
router.get('/:id/edit', (req, res) => {
  restaurantList.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('edit', { restaurant: restaurant })
  })
})

// Edit a restaurant info
router.put('/:id', (req, res) => {
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
      res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// Delete a restaurant
router.delete('/:id/delete', (req, res) => {
  restaurantList.findById(req.params.id, (err, todo) => {
    if (err) console.error(err)
    todo.remove(err => {
      if (err) console.error(err)
      res.redirect(`/`)
    })
  })
})

router.get('/category/:category', (req, res) => {
  restaurantList.find((err, restaurants) => {
    const keyword = req.params.category
    if (err) return console.error(err)
    const restaurantResults = restaurants.filter(({ name, category }) => {
      return (category.toLowerCase().includes(keyword.toLowerCase()))
    })
    res.render('index', { restaurants: restaurantResults })
  })
})


router.get('/sort/:condition', (req, res) => {
  let keyword = req.params
  let choice = {}
  switch (keyword.condition) {
    case 'nameasc':
      choice = { name_en: 'asc' }
      break;
    case 'namedesc':
      choice = { name_en: 'desc' }
      break;
    case 'category':
      choice = { category: 'asc' }
      break;
    case 'location':
      choice = { location: 'asc' }
      break;
    default:
  }
  restaurantList.find({}).sort(choice).exec((err, restaurants) => {
    if (err) return console.error(err)
    let result = []
    restaurants.forEach(e => {
      result.push(e.category)
    })
    categories = [...new Set(result)]
    return res.render('index', { restaurants: restaurants, categories: categories })
  })
})

module.exports = router