const mongoose = require("mongoose");
const Product = require("./models/Product");
const fs = require("fs");

// Replace this with your actual MongoDB connection string
mongoose.connect("mongodb://127.0.0.1:27017/smartbuy", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => console.error("❌ DB connection failed", err));

// Load products from JSON file
const products = JSON.parse(fs.readFileSync("productsData.json", "utf-8"));

// Insert into MongoDB
async function seed() {
  try {
    await Product.deleteMany({}); // Optional: clears old data
    await Product.insertMany(products);
    console.log("✅ Products inserted successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error inserting products:", err);
    mongoose.disconnect();
  }
}

seed();
