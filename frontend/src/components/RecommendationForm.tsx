import React, { useState } from 'react';
import axios from 'axios';

const RecommendationForm: React.FC = () => {
  const [productType, setProductType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/api/recommend/recommend', {
        params: {
          productType,
          maxPrice,
          features: features.split(',').map(f => f.trim()).join(',')
        }
      });

      setResults(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Get Product Recommendations</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Product Type (e.g. Laptop)</label>
          <input
            type="text"
            value={productType}
            onChange={e => setProductType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Features (comma separated)</label>
          <input
            type="text"
            value={features}
            onChange={e => setFeatures(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Get Recommendations
        </button>
      </form>

      {results && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white">Exact Matches</h3>
          {results.exactMatches.length > 0 ? (
            <ul className="list-disc ml-6 text-white">
              {results.exactMatches.map((product: any) => (
                <li key={product._id}>{product.name} - ₹{product.price}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No exact matches found.</p>
          )}

          <h3 className="text-xl font-bold text-white mt-6">Similar Products</h3>
          {results.similarProducts.length > 0 ? (
            <ul className="list-disc ml-6 text-white">
              {results.similarProducts.map((product: any) => (
                <li key={product._id}>{product.name} - ₹{product.price}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No similar products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;
