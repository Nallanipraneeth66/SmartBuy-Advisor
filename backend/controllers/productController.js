// Add this at the top if not already present
const Product = require('../models/Product').default;

// Replace or add this new function:
exports.getRecommendations = async (req, res) => {
  const { productType, maxPrice, features } = req.query;

  const featureArray = features ? features.split(',').map(f => f.trim()) : [];

  const query = {
    category: new RegExp(productType, 'i'), // Match Laptop, laptop, etc.
    ...(maxPrice && { price: { $lte: Number(maxPrice) } })
  };

  try {
    const products = await Product.find(query);

    const exactMatches = products.filter(p =>
      featureArray.every(f => p.features.includes(f))
    );

    const similarProducts = products.filter(p =>
      !exactMatches.includes(p)
    );

    res.json({ exactMatches, similarProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
