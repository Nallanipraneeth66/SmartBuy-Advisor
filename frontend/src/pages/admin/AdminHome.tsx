import React, { useState } from 'react';
import { productAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminHome: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    category: '',
    features: '',
    price: '',
    rating: '',
    description: '',
    link: '',
    image: '',
    buyFrom: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const dataToSend = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()),
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating)
    };

    try {
      await productAPI.createProduct(dataToSend);
      setSuccess('Product added successfully!');
      setFormData({
        name: '',
        company: '',
        category: '',
        features: '',
        price: '',
        rating: '',
        description: '',
        link: '',
        image: '',
        buyFrom: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Product</h1>
            <p className="text-blue-100">Fill in the product details below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                {['name', 'company', 'category', 'price', 'rating'].map(field => (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field}
                      {['price', 'rating'].includes(field) && ' (number)'}
                    </label>
                    <input
                      name={field}
                      type={field === 'price' || field === 'rating' ? 'number' : 'text'}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      step={field === 'rating' ? '0.1' : undefined}
                      min={field === 'rating' ? '0' : undefined}
                      max={field === 'rating' ? '5' : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {['link', 'image', 'buyFrom'].map(field => (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <input
                      name={field}
                      type="text"
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                  <input
                    name="features"
                    type="text"
                    value={formData.features}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., 8GB RAM, 256GB SSD, 15.6 inch"
                  />
                </div>
              </div>
            </div>

            {/* Description (full width) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              {success && (
                <div className="flex-1">
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex-1">
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;