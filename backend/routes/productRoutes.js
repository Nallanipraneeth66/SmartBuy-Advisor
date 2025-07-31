const express = require("express");
const router = express.Router();
const path = require("path");
const Product = require(path.join(__dirname, "../models/Product"));

// Add a product
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// Update a product by ID (PUT /api/products/:id)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

// Delete a product by ID (DELETE /api/products/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// Search products
router.get("/search", async (req, res) => {
  try {
    const { category, company, maxPrice, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (company) query.company = company;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { features: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(query);
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error searching products", error: err.message });
  }
});

// Compare two products
router.get("/compare", async (req, res) => {
  try {
    const { id1, id2 } = req.query;
    const product1 = await Product.findById(id1);
    const product2 = await Product.findById(id2);
    if (!product1 || !product2) {
      return res.status(404).json({ message: "One or both products not found" });
    }
    res.status(200).json({ product1, product2 });
  } catch (err) {
    res.status(500).json({ message: "Comparison failed", error: err.message });
  }
});

module.exports = router;
