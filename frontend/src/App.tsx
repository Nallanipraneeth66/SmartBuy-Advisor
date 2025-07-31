//import React from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account'; //  Your account page
import HistoryPage from './pages/History';
import Help from './pages/Help'
import Home from './pages/Home'
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import  TermsOfService  from './pages/TermsOfService';
import RecommendationForm from './components/RecommendationForm';
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminHelp from './pages/admin/AdminHelp';


const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  
      return (
    <>
      {!isAdminRoute && <Navbar />} {/*  Hide navbar on AdminPages */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        
        <Route path="/home" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermsOfService/>}/>
        <Route path="/recommend" element={<RecommendationForm />} />
        <Route path='/help' element={<Help/>} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminHome />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="help" element={<AdminHelp />} />
</Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
