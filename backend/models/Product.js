const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  company: String,
  category: String,
  features: [String],
  price: Number,
  rating: Number,
  description: String,
  buyFrom: String,            
  link: String,               
  image: String               
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
