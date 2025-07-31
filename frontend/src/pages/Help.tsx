import React, { useState, useEffect } from 'react';
import { submitFeedback } from '../api/feedbackAPI';

const Help: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user && (user._id || user.id)) {
      setUserId(user._id || user.id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('User not logged in');
      return;
    }

    if (feedback.trim()) {
      try {
        await submitFeedback(userId, feedback);
        setSubmitted(true);
        setFeedback('');
      } catch (err) {
        console.error('Error submitting feedback:', err);
        alert('Error submitting feedback');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-cyan-100 to-emerald-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Help & Support</h1>
          <p className="text-center text-indigo-100 mt-2">
            We're here to help you get the most out of SmartBuy Advisor
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Introduction */}
          <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What is SmartBuy Advisor?
            </h2>
            <p className="text-gray-700">
              SmartBuy is an AI-powered platform that helps you find the best product based on your budget, features, and trusted brands. Our goal is to make your shopping smarter and easier.
            </p>
          </section>

          {/* How to Use */}
          <section className="bg-cyan-50 p-6 rounded-lg border border-cyan-100">
            <h2 className="text-xl font-semibold text-cyan-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              How to Use SmartBuy
            </h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li className="pb-1">Choose the type of product (e.g., Mobile, Laptop, AC, etc.).</li>
              <li className="pb-1">Set your maximum budget.</li>
              <li className="pb-1">Enter features you care about (e.g., i7 processor, 5-star rating).</li>
              <li>Click "Get Recommendations" to see AI-selected best picks.</li>
            </ol>
          </section>

          {/* Why SmartBuy */}
          <section className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
            <h2 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Why Use SmartBuy?
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li className="pb-1">AI filters only the most trusted and reputed brands.</li>
              <li className="pb-1">Shows the best price store (Amazon, Flipkart, Official site).</li>
              <li className="pb-1">Highlights AI Top Pick for best value.</li>
              <li>Estimates expected lifespan of products.</li>
            </ul>
          </section>

          {/* FAQs */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-cyan-700">Q: What if I don't get any results?</strong>
                <p className="text-gray-700 mt-1">A: Try adjusting the budget or features. If no product matches all conditions, the AI will show similar top picks soon.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-cyan-700">Q: How do I save or compare products?</strong>
                <p className="text-gray-700 mt-1">A: You can add items to wishlist or use upcoming compare features.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-cyan-700">Q: How is this different from Amazon?</strong>
                <p className="text-gray-700 mt-1">A: SmartBuy doesn't sell products — it guides you to the best one using AI and price comparison logic across platforms.</p>
              </div>
            </div>
          </section>

          {/* Feedback Form */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Share Your Feedback
            </h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                <p className="font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thank you for your feedback!
                </p>
                <p className="mt-1 text-sm">We appreciate your input to help improve SmartBuy Advisor.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200"
                  placeholder="Tell us what you liked or what we can improve..."
                  rows={4}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:from-cyan-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Submit Feedback
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
