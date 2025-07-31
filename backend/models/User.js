const mongoose = require("mongoose");

const SearchHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  query: { type: String, required: true },
  productType: { type: String },
  maxPrice: { type: Number },
  features: { type: [String] },
  resultsCount: { type: Number },
  timestamp: { type: Date, default: Date.now },
  isInWishlist: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    photoURL: String,
    isAdmin: { type: Boolean, default: false },
    searchHistory: [SearchHistorySchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
