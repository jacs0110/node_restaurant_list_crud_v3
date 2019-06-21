const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  id: Number,
  name: { type: String, require: true, },
  name_en: String,
  category: String,
  img: String,
  location: String,
  phone: String,
  google_map: String,
  rating: Number,
  description: String,
}, { collection: 'restaurants' })

module.exports = mongoose.model('restaurantList', restaurantSchema)