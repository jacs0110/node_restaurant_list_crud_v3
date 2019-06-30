const express = require('express')
const router = express.Router()
const restaurantList = require('../models/restaurantList.js')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router