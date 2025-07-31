import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-green-500 text-white px-6 py-4 flex justify-between items-center shadow-md border-b border-white/20">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="space-x-4">
        <Link to="/admin/home" className="hover:underline">Home</Link>
        <Link to="/admin/users" className="hover:underline">Users</Link>
        <Link to="/admin/products" className="hover:underline">Products</Link>
        <Link to="/admin/help" className="hover:underline">Help</Link>
        <button onClick={handleLogout} className="hover:underline">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
