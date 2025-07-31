import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getSearchHistoryAPI,
  deleteSearchHistoryItem,
  clearSearchHistory,
  updateSearchHistoryItem, //  add this in your historyAPI (shown below)
} from '../api/historyAPI';
import { History, Heart, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface SearchHistoryItem {
  _id: string;
  query: string;
  productType?: string;
  maxPrice?: number;
  features?: string[];
  resultsCount: number;
  timestamp?: string;
  isMarked?: boolean;
}

const HistoryPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [marking, setMarking] = useState<string | null>(null); // track mark in-flight

  const normalizeHistory = (raw: any): SearchHistoryItem[] => {
  const arr =
    Array.isArray(raw?.searchHistory)
      ? raw.searchHistory
      : Array.isArray(raw?.data?.searchHistory)
      ? raw.data.searchHistory
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];

  return arr.map((item: any) => ({
    ...item,
    isMarked: item.isInWishlist ?? false, //  Normalize it here
  }));
};


  const fetchHistory = async () => {
    //  Always end loading, even if no user id (new/guest user)
    if (!user?.id) {
      setHistoryItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getSearchHistoryAPI(user.id);
      setHistoryItems(normalizeHistory(data));
    } catch (err) {
      console.error('Failed to fetch search history:', err);
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until auth finishes loading; then fetch (or stop spinner if not logged in)
    if (!authLoading) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  const handleMark = async (itemId: string) => {
    if (!user?.id) return;
    const current = historyItems.find((x) => x._id === itemId);
    if (!current) return;

    const next = !current.isMarked;

    // Optimistic update
    setMarking(itemId);
    setHistoryItems((prev) =>
      prev.map((it) => (it._id === itemId ? { ...it, isMarked: next } : it))
    );

    try {
      //  Persist to DB
      await updateSearchHistoryItem(user.id, itemId, next );
    } catch (err) {
      console.error('Error updating mark:', err);
      // Rollback on failure
      setHistoryItems((prev) =>
        prev.map((it) => (it._id === itemId ? { ...it, isMarked: !next } : it))
      );
    } finally {
      setMarking(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!user?.id) return;
    try {
      setDeleting(itemId);
      await deleteSearchHistoryItem(user.id, itemId);
      setHistoryItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      setClearing(true);
      await clearSearchHistory(user.id);
      setHistoryItems([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <History className="h-6 w-6 mr-2 text-blue-700" />
            Your Search History
          </h1>
          <p className="mt-2 text-gray-600">
            {user ? `Welcome back, ${user.name}` : 'Your recent searches will show up here.'}
          </p>
          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-4 text-sm text-red-700 hover:text-red-800 font-medium flex items-center transition-colors"
              disabled={clearing}
            >
              {clearing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All History
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <History className="h-12 w-12 text-blue-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No search history yet</h3>
            <p className="text-gray-600 mb-6">Your recent searches will appear here once you start searching.</p>
            <Link
              to="/home"
              className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.query}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.productType && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.productType}
                        </span>
                      )}
                      {!!item.maxPrice && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          ₹{Number(item.maxPrice).toLocaleString()}
                        </span>
                      )}
                      {item.features?.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {formatDate(item.timestamp)} {item.resultsCount != null ? `• ${item.resultsCount} results found` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() => handleMark(item._id)}
                      disabled={marking === item._id}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                        item.isMarked
                          ? 'bg-red-50 border border-rose-200 text-rose-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {marking === item._id ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${
                            item.isMarked ? 'fill-red-500 text-red-600' : 'text-gray-500'
                          }`}
                        />
                      )}
                      <span className="ml-2">
                        {item.isMarked ? 'Marked' : 'Mark'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      className="flex items-center px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 hover:border-red-200 transition-colors text-sm"
                    >
                      {deleting === item._id ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2">Delete</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={{
                        pathname: '/home', // ← if your Home route is '/home', change this back
                        search: `?query=${encodeURIComponent(item.query)}&productType=${encodeURIComponent(
                          item.productType || ''
                        )}&maxPrice=${item.maxPrice || ''}&features=${encodeURIComponent(
                          (item.features || []).join(',')
                        )}`,
                      }}
                      className="flex items-center px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm shadow-sm hover:shadow-md transition-all"
                    >
                      Search Again
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
