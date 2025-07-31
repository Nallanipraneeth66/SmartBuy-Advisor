import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { authAPI } from '../services/api';

// User Interface
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  role?: 'user' | 'admin';
  isAdmin?: boolean;
}

// Context Type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  try {
    const savedToken = sessionStorage.getItem('token');
    const savedUserRaw = sessionStorage.getItem('user');

    if (
      savedToken &&
      savedUserRaw &&
      savedUserRaw !== 'undefined' &&
      savedUserRaw !== 'null'
    ) {
      const savedUser = JSON.parse(savedUserRaw);

      // Normalize _id if necessary
      const normalizedUser = savedUser.id
        ? savedUser
        : { ...savedUser, id: savedUser._id };

      setToken(savedToken);
      setUser(normalizedUser);
    }
  } catch (err) {
    console.error('Failed to load user from sessionStorage:', err);
  } finally {
    setIsLoading(false);
  }
}, []);


  //  Login method
  const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    const { token: authToken, user: userData } = response.data;

    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id || '', // fallback check
    };

    if (!normalizedUser.id) {
      throw new Error('User ID is missing in server response');
    }

    setToken(authToken);
    setUser(normalizedUser);
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(normalizedUser));
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Login failed'
    );
  }
};



  //  Signup method
  const signup = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string
) => {
  try {
    const response = await authAPI.signup(name, email, password, phone, address);

   if (response.data && response.data.user) {
  const userData = response.data.user;

  const normalizedUser = {
    id: userData.id || userData._id || '',
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    address: userData.address || '',
    photoURL: userData.photoURL || '',
    isAdmin: userData.isAdmin || false,
  };

  if (!normalizedUser.id) {
    throw new Error('User ID is missing in server response');
  }

  // Save to sessionStorage
  sessionStorage.setItem('user', JSON.stringify(normalizedUser));
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
  }

  setUser(normalizedUser);
}
 else {
      console.error('Signup failed: No user data in response');
    }
  } catch (err) {
    console.error('Signup error:', err);
  }
};




  //  Logout method
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  //  Update user locally
  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser as User);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to update user:', err);
      throw new Error('Could not update user data');
    }
  };

  //  Admin check
 const isAdmin = user?.isAdmin === true;


  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    updateUser,
    isLoading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
