const express = require('express')
const router = express.Router()
const restaurantList = require('../models/restaurantList.js')

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router