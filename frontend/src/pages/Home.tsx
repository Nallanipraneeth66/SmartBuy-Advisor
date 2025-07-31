import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';


const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-green-100 text-gray-800">
      {/*  Top-right Login/Signup buttons */}
      {!user && (
        <div className="flex justify-end items-center gap-4 p-4">
          <Link
            to="/login"
            className="text-indigo-700 hover:text-indigo-900 font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/*  Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex justify-center mb-6">
          <img
          src="/logo.png"
          alt="SmartBuy Logo"
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-full shadow-xl bg-black bg-opacity-10 p-2"
        />

        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow">
          Discover Products with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500">
            SmartBuy Advisor
          </span>
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          AI-driven recommendations to help you find the best product tailored to your preferences and budget.
        </p>

        {/*  Call-to-action */}
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition duration-200 shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-indigo-700 text-lg font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition duration-200"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <Link
            to="/home"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
          >
            Go to HomePage
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        )}
      </div>

      {/*  Features Section */}
      <section className="bg-white bg-opacity-80 backdrop-blur-sm py-20 rounded-t-3xl shadow-inner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why SmartBuy Advisor?</h2>
            <p className="text-lg text-gray-700">
              SmartBuy Advisor helps users discover top-rated and budget-friendly products using smart algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <Feature icon={<Brain className="h-8 w-8 text-indigo-600" />} title="AI-Powered">
              Recommends products using cutting-edge machine learning.
            </Feature>
            <Feature icon={<Sparkles className="h-8 w-8 text-green-600" />} title="Personalized">
              Tailored results based on user preferences and activity.
            </Feature>
            <Feature icon={<Users className="h-8 w-8 text-blue-600" />} title="User-Friendly">
              Easy-to-use interface for all experience levels.
            </Feature>
            <Feature icon={<Shield className="h-8 w-8 text-yellow-600" />} title="Secure">
              Your data is encrypted and securely stored.
            </Feature>
          </div>
        </div>
      </section>
    </div>
  );
};

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="text-center px-4">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center shadow-md">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default Home;
