import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.code === 'ERR_NETWORK') {
      error.message = `Unable to connect to server. Please make sure the backend is running on ${API_BASE_URL}`;
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string
  ) => apiClient.post('/api/auth/signup', { name, email, password, phone, address }),
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
};

// User APIs (fixed missing /api prefix)
export const userAPI = {
  getUsers: () => apiClient.get('/api/users'),
  deleteUser: (id: string) => apiClient.delete(`/api/users/${id}`),
  getUserById: (id: string) => apiClient.get(`/api/users/${id}`).then((res) => res.data),
  updateUser: (id: string, data: any) => apiClient.put(`/api/users/${id}`, data).then((res) => res.data),
  updatePassword: (id: string, data: any) => apiClient.put(`/api/users/${id}/password`, data).then((res) => res.data),
};

// Product APIs
export const productAPI = {
  getAll: () => apiClient.get('/api/products'),
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
  }) => apiClient.post('/api/products/add', data),
  updateProduct: (id: string, data: any) => apiClient.put(`/api/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/api/products/${id}`),
};

export const feedbackAPI = {
  getAll: () => apiClient.get('/api/feedback'),
};

export const recommendationAPI = {
  getRecommendations: (params: {
    productType: string;
    maxPrice?: number;
    features?: string[];
  }) => apiClient.post('/api/recommend/recommend', params),
};

export default apiClient;
