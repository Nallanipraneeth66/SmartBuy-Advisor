import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  
  Home,
  History as HistoryIcon,
  User,
  HelpCircle,
  Settings,
  Menu,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const hideOnPaths = ['/admin', '/admin/users', '/admin/products', '/admin/help','/signup','/login','/'];
  if (hideOnPaths.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-blue-600 to-green-500 shadow-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
  <div className="bg-[#0B0D18] p-1 rounded-full">
    <img src="/logo.png" alt="SmartBuy Logo" className="h-10 w-10 object-contain rounded-full" />
  </div>
  <span className="text-xl font-extrabold text-white tracking-wide drop-shadow">
    SmartBuy Advisor
  </span>
</div>


        {/* Desktop Links */}

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/home"
            className={`flex items-center font-semibold transition ${
              isActive('/home')
                ? 'text-white underline underline-offset-4'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>

          <Link
            to="/history"
            className={`flex items-center font-semibold transition ${
              isActive('/history')
                ? 'text-white underline underline-offset-4'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <HistoryIcon className="w-4 h-4 mr-1" /> History
          </Link>

          <Link
            to="/account"
            className={`flex items-center font-semibold transition ${
              isActive('/account')
                ? 'text-white underline underline-offset-4'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-1" /> Account
          </Link>

          <Link
            to="/help"
            className={`flex items-center font-semibold transition ${
              isActive('/help')
                ? 'text-white underline underline-offset-4'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 mr-1" /> Help
          </Link>

          {!user &&isAdmin && (
            <Link
              to="/admin"
              className="text-white/90 hover:text-white font-semibold flex items-center transition"
            >
              <Settings className="w-4 h-4 mr-1" /> Admin
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="text-white/90 hover:text-white font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 text-white px-4 py-4 space-y-3">
          <Link to="/home" className="block" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/history" className="block" onClick={() => setMenuOpen(false)}>
            History
          </Link>
          <Link to="/account" className="block" onClick={() => setMenuOpen(false)}>
            Account
          </Link>
          <Link to="/help" className="block" onClick={() => setMenuOpen(false)}>
            Help
          </Link>
          {user && isAdmin && (
            <Link to="/admin" className="block" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block bg-white text-blue-700 mt-2 py-1 px-2 rounded" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
