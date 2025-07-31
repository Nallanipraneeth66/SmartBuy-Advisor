import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Edit,
  Save,
  Mail,
  Smartphone,
  MapPin,
  LogOut
} from 'lucide-react';

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
}

const Account: React.FC = () => {
  const { user, updateUser, logout } = useAuth() as {
    user: UserData | null;
    updateUser?: (data: UserData) => Promise<void>;
    logout: () => void;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    photoURL: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const { name = '', email = '', phone = '', address = '', photoURL = '' } = user;
      setFormData({ name, email, phone, address, photoURL });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (updateUser) {
        await updateUser(formData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-indigo-100 to-green-100 py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel - Profile Card */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-white hover:border-cyan-300 transition-all duration-300">
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-400 h-24" />
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-amber-200 to-yellow-200 flex items-center justify-center overflow-hidden shadow-lg">
                    {formData.photoURL ? (
                      <img src={formData.photoURL} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-amber-600" />
                    )}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-800">{formData.name || 'User'}</h2>
                  <p className="text-cyan-600 mt-1">{formData.email || 'Not provided'}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                      isEditing
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white'
                        : 'bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-white'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-5 w-5" />
                        Edit Profile
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-rose-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Information */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-white hover:border-sky-300 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                {isEditing && (
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="text-rose-500 hover:text-rose-700 font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              <div className="space-y-6">
                {[{ label: 'Full Name', name: 'name', icon: User },
                  { label: 'Email Address', name: 'email', icon: Mail },
                  { label: 'Phone Number', name: 'phone', icon: Smartphone },
                  { label: 'Address', name: 'address', icon: MapPin }].map(({ label, name, icon: Icon }) => (
                  <div className="flex items-start group" key={name}>
                    <div className="pt-2.5">
                      <Icon className="h-5 w-5 text-indigo-500 group-hover:text-cyan-500 transition-colors duration-200" />
                    </div>
                    <div className="ml-4 flex-1 border-b border-gray-100 pb-4 group-hover:border-cyan-200 transition-colors duration-200">
                      <label className="block text-sm font-medium text-cyan-600 mb-1">{label}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name={name}
                          value={formData[name as keyof UserData] || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border-2 border-cyan-100 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {formData[name as keyof UserData] || <span className="text-amber-500">Not provided</span>}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
