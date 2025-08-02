/*import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recommendationAPI } from '../services/api';
import { Star, DollarSign, Package, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

interface Product {
  id: string;
  name: string;
  price: number;
  features: string[];
  rating: number;
  company: string;
}

interface Preferences {
  company: string;
  maxPrice: string;
  features: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    company: '',
    maxPrice: '',
    features: '',
  });
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await recommendationAPI.getRecommendations({
        ...preferences,
        maxPrice: preferences.maxPrice ? parseFloat(preferences.maxPrice) : undefined,
        features: preferences.features.split(',').map(f => f.trim()).filter(Boolean),
      });
      setRecommendations(response.data.recommendations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Let's find the perfect products for you with AI-powered recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preferences Form *//* }
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Your Preferences
              </h2>

              {error && <ErrorMessage message={error} onClose={() => setError('')} />}

              <form onSubmit={handleGetRecommendations} className="space-y-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={preferences.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Apple, Samsung, Google"
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price ($)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={preferences.maxPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Features
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    value={preferences.features}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="e.g., wireless, fast charging, waterproof (separate with commas)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate features with commas</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Getting recommendations...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recommendations *//*}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package className="h-6 w-6 mr-2 text-blue-600" />
                Product Recommendations
              </h2>
              {recommendations.length > 0 && (
                <p className="text-gray-600 mt-1">
                  Found {recommendations.length} product{recommendations.length !== 1 ? 's' : ''} matching your preferences
                </p>
              )}
            </div>

            {recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                <p className="text-gray-600">
                  Fill out your preferences and click "Get Recommendations" to see personalized product suggestions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="text-2xl font-bold">{product.price}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.company}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; */