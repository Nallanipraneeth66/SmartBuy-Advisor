// src/pages/admin/AdminProducts.tsx
import React, { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  image?: string;
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productAPI.getAll();
      // If your API returns {data:{products:[]}} adjust accordingly.
      setProducts(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(id);
      await productAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete product';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      rating: p.rating,
      image: p.image,
    });
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setForm({});
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'price' || name === 'rating'
          ? (value === '' ? undefined : Number(value))
          : value,
    }));
  };

  const saveEdit = async () => {
    if (!editingProduct?._id) return;
    setSaving(true);
    try {
      const res = await productAPI.updateProduct(editingProduct._id, form);
      // Update the list with the returned updated product
      setProducts(prev => prev.map(p => (p._id === editingProduct._id ? res.data : p)));
      closeEdit();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update product';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">All Products</h1>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={product.image || '/placeholder.png'}
                onError={(e: any) => (e.currentTarget.src = '/placeholder.png')}
                alt={product.name}
                className="h-40 w-full object-contain mb-3"
              />
              <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 line-clamp-3">{product.description}</p>
              <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
              {product.rating !== undefined && (
                <p className="text-sm text-gray-500">Rating: {product.rating}</p>
              )}

              <div className="mt-3 flex gap-3">
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50`}
                  disabled={deletingId === product._id}
                  onClick={() => handleDelete(product._id)}
                >
                  {deletingId === product._id ? 'Deleting…' : 'Delete'}
                </button>

                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
                  onClick={() => openEdit(product)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Product</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  value={form.name ?? ''}
                  onChange={onChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description ?? ''}
                  onChange={onChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price ?? ''}
                    onChange={onChange}
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Rating</label>
                  <input
                    name="rating"
                    type="number"
                    step="0.1"
                    value={form.rating ?? ''}
                    onChange={onChange}
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="0-5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  name="image"
                  value={form.image ?? ''}
                  onChange={onChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="https://…"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border"
                onClick={closeEdit}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
