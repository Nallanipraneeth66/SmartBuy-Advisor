// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recommendationAPI } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, ExternalLink, Tag, Zap, Clock  } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { addToSearchHistoryAPI, getSearchHistoryAPI } from '../api/historyAPI';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  features: string[];
  description?: string;
  rating: number;
  company: string;
  image: string;
  estimatedLifespan?: string;
  isAIRecommended?: boolean;
  storeLinks?: {
    amazon?: string;
    flipkart?: string;
    official?: string;
    prices?: {
      amazon?: number;
      flipkart?: number;
      official?: number;
    };
  };
  buyFrom?: string;
  link?: string;
}

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Keep form values as strings; parse right before API call
  const [searchQuery, setSearchQuery] = useState<{
    productType: string;
    maxPrice: string;
    features: string; // CSV string
  }>({
    productType: '',
    maxPrice: '',
    features: '',
  });

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [_searchHistory, setSearchHistory] = useState<any[]>([]);

  // ---------- Helpers ----------
  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 24 24"
          fill={star <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );

  const getBestStore = (product: Product) => {
    const prices = product.storeLinks?.prices;
    if (!prices) return null;

    const validPrices = Object.entries(prices)
      .filter(([, price]) => price !== undefined)
      .sort((a, b) => (Number(a[1]) || 0) - (Number(b[1]) || 0));

    return validPrices.length > 0 ? validPrices[0][0] : null;
  };

  const renderBestPriceBadge = (store: string | null) => {
    if (!store) return null;
    const storeName = store.charAt(0).toUpperCase() + store.slice(1);
    return (
      <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded mb-2">
        <Tag className="w-3 h-3 mr-1" />
        Best price at {storeName}
      </div>
    );
  };

  const renderAIRecommendedBadge = () => (
    <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded mb-2 ml-2">
      <Zap className="w-3 h-3 mr-1" />
      AI Recommended
    </div>
  );

  const renderLifespanBadge = (lifespan?: string) => {
    if (!lifespan) return null;
    return (
      <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
        <Clock className="w-3 h-3 mr-1" />
        {lifespan}
      </div>
    );
  };

  const renderProductCard = (product: Product) => {
    const bestStore = getBestStore(product);

    return (
      <div key={product._id || product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
        <div className="p-4 flex-grow">
          <div className="relative">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-48 object-contain mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
            <div className="absolute top-2 left-2 flex">
              {renderBestPriceBadge(bestStore)}
              {product.isAIRecommended && renderAIRecommendedBadge()}
              {renderLifespanBadge(product.estimatedLifespan)}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-green-600 font-bold text-xl">₹{product.price.toLocaleString()}</span>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.company}</span>
          </div>

          <div className="flex items-center mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">({product.rating.toFixed(1)})</span>
          </div>

          {product.description && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>
          )}

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Key Features:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {product.features.slice(0, 3).map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          {product.buyFrom && product.link && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Available on: <span className="font-medium">{product.buyFrom}</span>
              </p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-1 text-sm text-indigo-600 hover:underline"
              >
                View Product <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          )}

          {product.storeLinks && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {product.storeLinks.amazon && (
                <a
                  href={product.storeLinks.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded hover:bg-orange-200 transition-colors"
                >
                  Amazon <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {product.storeLinks.flipkart && (
                <a
                  href={product.storeLinks.flipkart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  Flipkart <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {product.storeLinks.official && (
                <a
                  href={product.storeLinks.official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  Official Store <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------- Data functions ----------
  const fetchUserSearchHistory = async () => {
    if (!user || !user.id) return;
    try {
      const res = await getSearchHistoryAPI(user.id);
      const history =
        Array.isArray((res as any)?.data) ? (res as any).data :
        Array.isArray((res as any)?.searchHistory) ? (res as any).searchHistory :
        Array.isArray((res as any)?.data?.searchHistory) ? (res as any).data.searchHistory :
        [];
      setSearchHistory(history);
    } catch (err) {
      console.error('Failed to fetch search history:', err);
    }
  };
// ---------- Event handlers ----------
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setSearchQuery((prev) => ({ ...prev, [name]: value }));
  if (error) setError('');
};

const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.productType.trim()) {
    setError('Please enter a product type');
    return;
  }

  setIsLoading(true);
  setError('');
  setRecommendations([]);
  setSimilarProducts([]);

  try {
    const featuresArray = String(searchQuery.features || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const maxPriceNum = searchQuery.maxPrice ? Number(searchQuery.maxPrice) : undefined;

    const response = await recommendationAPI.getRecommendations({
      productType: searchQuery.productType.trim(),
      maxPrice: maxPriceNum,
      features: featuresArray,
    });

    const data = response.data;
    setRecommendations(data.exactMatches || []);
    setSimilarProducts(data.similarProducts || []);

    // Save to history (no UI list on this page, but keep server-side record)
    if (user?.id) {
      const totalResults = (data.exactMatches?.length || 0) + (data.similarProducts?.length || 0);
      const queryString = `${searchQuery.productType}${maxPriceNum ? ` under ₹${maxPriceNum}` : ''}`;

      try {
        await addToSearchHistoryAPI(user.id, {
          query: queryString,
          productType: searchQuery.productType,
          maxPrice: maxPriceNum,
          features: featuresArray,
          resultsCount: totalResults,
        });
      } catch (err) {
        console.error('Error saving search history:', err);
      }
    }
  } catch (err: any) {
    console.error('API Error:', err);
    setError(err?.response?.data?.message || err.message || 'Failed to get recommendations.');
  } finally {
    setIsLoading(false);
  }
};

// Re-run a search from URL params only (history UI removed)
const handleSearchFromHistory = async (query: { productType: string; maxPrice: string; features: string }) => {
  setIsLoading(true);
  setError('');
  setRecommendations([]);
  setSimilarProducts([]);

  try {
    const featuresArray = String(query.features || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const maxPriceNum = query.maxPrice ? Number(query.maxPrice) : undefined;

    const response = await recommendationAPI.getRecommendations({
      productType: query.productType.trim(),
      maxPrice: maxPriceNum,
      features: featuresArray,
    });

    const data = response.data;
    setRecommendations(data.exactMatches || []);
    setSimilarProducts(data.similarProducts || []);
  } catch (err: any) {
    console.error('API Error:', err);
    setError('Something went wrong fetching previous search. Try again.');
  } finally {
    setIsLoading(false);
  }
};

  // ---------- Effects ----------
  useEffect(() => {
    if (user?.id) fetchUserSearchHistory();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    const productType = params.get('productType') || '';
    const maxPrice = params.get('maxPrice') || '';
    const features = params.get('features') || '';

    if (query || productType || maxPrice || features) {
      const restored = { productType, maxPrice, features };
      setSearchQuery(restored);
      setTimeout(() => handleSearchFromHistory(restored), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-cayn-200 via-green-200 via-blue-200 to-pink-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-indigo-700">SmartBuy</span>, {user?.name || 'Guest'}!
          </h1>
          <p className="mt-2 text-gray-700 text-lg">Discover top-rated products at the best prices in India.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Search className="h-5 w-5 mr-2 text-pink-600" />
            What are you looking for?
          </h2>

          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="productType"
                placeholder="e.g., Mobile, Laptop, Phone"
                value={searchQuery.productType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Maximum Price"
                value={searchQuery.maxPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="features"
                placeholder="Features (e.g. snapdragon 8 gen 2, 144hz, amoled)"
                value={searchQuery.features}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto mx-auto block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl hover:from-indigo-600 hover:to-pink-600 font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="h-5 w-5 inline mr-2" />
                  Get Recommendations
                </>
              )}
            </button>
          </form>
        </div>

       

        {/* Results */}
        {!isLoading && (
          <>
            {recommendations.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect Matches for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map(renderProductCard)}
                </div>
              </section>
            )}

            {recommendations.length === 0 && searchQuery.productType && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No exact matches found for "{searchQuery.productType}"
                </h3>
                <p className="text-gray-600">
                  We couldn't find products that match all your criteria exactly.
                </p>
              </div>
            )}

            {similarProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarProducts.map(renderProductCard)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-pink-400 mr-2" />
                <span className="text-xl font-bold">SmartBuy</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">Genuine product recommendations powered by AI.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} SmartBuy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
