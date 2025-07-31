const path = require('path');
const Product = require(path.join(__dirname, '../models/Product'));

const VALID_CATEGORIES = ['ACs', 'EarPods', 'Laptop', 'Mobile', 'Shoes', 'Smartphones', 'TVs', 'Watches'];

const norm = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');

// Rules that map user words to one or more of your real categories
const CATEGORY_RULES = [
  { cats: ['Mobile', 'Smartphones'], words: ['phone', 'smartphone', 'mobile', 'cell phone', 'android', 'iphone'] },
  { cats: ['EarPods'], words: ['earpods', 'earbuds', 'earphones', 'airdopes', 'buds', 'tws'] },
  { cats: ['Laptop'], words: ['laptop', 'notebook', 'ultrabook'] },
  { cats: ['TVs'], words: ['tv', 'television', 'smart tv'] },
  { cats: ['Watches'], words: ['watch', 'smartwatch', 'smart watch'] },
  { cats: ['ACs'], words: ['ac', 'air conditioner', 'aircon', 'air conditioning'] },
  { cats: ['Shoes'], words: ['shoe', 'shoes', 'sneaker', 'sneakers', 'running shoe'] },
];

// Map user input to one or more DB categories
function resolveCategories(inputText) {
  const n = norm(inputText);
  if (!n) return [];

  // Direct exact matches to your DB categories (case/space-insensitive)
  const direct = VALID_CATEGORIES.filter((c) => norm(c) === n);
  if (direct.length) return direct;

  // Rule-based mapping (substring check on normalized input)
  const out = new Set();
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some((w) => n.includes(norm(w)))) {
      rule.cats.forEach((c) => out.add(c));
    }
  }
  return [...out];
}

function buildStoreLinks(p) {
  // If only single store/link in DB, normalize to storeLinks object
  if (!p.storeLinks && p.buyFrom && p.link) {
    const key = String(p.buyFrom).toLowerCase();
    return { [key]: p.link, prices: { [key]: p.price } };
  }
  return p.storeLinks || {};
}

function toClient(p) {
  return {
    _id: p._id,
    name: p.name,
    company: p.company,
    category: p.category,
    features: p.features,
    price: p.price,
    rating: p.rating,
    description: p.description,
    image: p.image,        // <-- from DB
    buyFrom: p.buyFrom,
    link: p.link,
    storeLinks: buildStoreLinks(p),
    isAIRecommended: true,
  };
}

exports.getRecommendations = async (req, res) => {
  try {
    const productText = String(req.body.productType || '').trim();
    const maxPrice = req.body.maxPrice;
    const features = Array.isArray(req.body.features)
      ? req.body.features
      : String(req.body.features || '').split(',').map((s) => s.trim()).filter(Boolean);

    const reqFeaturesNorm = features.map(norm);

    // Build a scoped query
    const base = {};
    const cats = resolveCategories(productText);
    if (cats.length) {
      base.category = { $in: cats };
    } else if (productText) {
      // Fuzzy fallback on name/category when user typed something else
      const safe = norm(productText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(safe, 'i');
      base.$or = [{ category: rx }, { name: rx }];
    }
    if (maxPrice) base.price = { $lte: Number(maxPrice) };

    // Fetch candidates ONLY within the scope
    const candidates = await Product.find(base);
    if (!candidates.length) return res.json({ exactMatches: [], similarProducts: [] });

    // Score candidates
    const scored = candidates.map((p) => {
      const pf = (p.features || []).map(norm);
      const matchCount = reqFeaturesNorm.filter((f) => pf.includes(f)).length;
      const allFeaturesMatch = reqFeaturesNorm.length > 0 && matchCount === reqFeaturesNorm.length;

      
      const score =
        (allFeaturesMatch ? 1 : 0) * 1_000_000 +
        matchCount * 1_000 +
        (Number(p.rating) || 0) * 10 -
        (Number(p.price) || 0) / 10;

      return { p, score };
    });

    // ONE best recommendation
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0]?.p ? [toClient(scored[0].p)] : [];
    const similar = scored.slice(1).map((x) => toClient(x.p));

    return res.json({ exactMatches: best, similarProducts: similar });
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
