import React, { useEffect, useState } from 'react';
import { feedbackAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { MessageSquare, User } from 'lucide-react';

const AdminHelp: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await feedbackAPI.getAll();
        setFeedbacks(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Could not load feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <MessageSquare className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
            <p className="text-gray-600">Review what users are saying about SmartBuy Advisor</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ErrorMessage message={error} onClose={() => setError('')} />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No feedback yet</h3>
            <p className="text-gray-600">User feedback will appear here when submitted</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {feedbacks.map((fb) => (
              <div 
                key={fb._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <User className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {fb.userId?.name || 'Anonymous User'}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {fb.userId?.email || 'No email provided'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 italic">"{fb.message}"</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {new Date(fb.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span>
                      {new Date(fb.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
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

export default AdminHelp;