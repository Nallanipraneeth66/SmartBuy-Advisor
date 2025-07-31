// src/pages/admin/AdminLayout.tsx

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Users, Package, HelpCircle, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: any) =>
    `inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#0B0D18] text-white px-6 py-4 flex justify-between items-center shadow-md border-b border-white/10">
  <div className="flex items-center gap-3">
    <img src="/logo.png" alt="SmartBuy Logo" className="h-8 w-8 rounded-full" />
    <span className="text-xl font-bold text-white">
      SmartBuy Advisor Admin Panel
    </span>
  </div>

  <nav className="flex items-center gap-4">
    <NavLink to="/admin" end className={navLinkClass}>
      <Home size={16} /> Home
    </NavLink>
    <NavLink to="/admin/users" className={navLinkClass}>
      <Users size={16} /> Users
    </NavLink>
    <NavLink to="/admin/products" className={navLinkClass}>
      <Package size={16} /> Products
    </NavLink>
    <NavLink to="/admin/help" className={navLinkClass}>
      <HelpCircle size={16} /> Help
    </NavLink>
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-md"
    >
      <LogOut size={16} /> Logout
    </button>
  </nav>
</header>


      {/* Page Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
