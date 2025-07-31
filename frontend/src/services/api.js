import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
  deleteAccount: () => api.delete('/auth/profile/delete/'),
  checkStatus: () => api.get('/auth/status/'),
};

export const forumsAPI = {
  getCategories: () => api.get('/forums/categories/'),
  getCategoryPosts: (categorySlug, params) => api.get(`/forums/categories/${categorySlug}/posts/`, { params }),
  createPost: (data) => api.post('/forums/posts/', data),
  getPostDetail: (postId) => api.get(`/forums/posts/${postId}/`),
  replyToPost: (postId, data) => api.post(`/forums/posts/${postId}/replies/`, data),
  likePost: (postId) => api.post(`/forums/posts/${postId}/like/`),
  likeReply: (replyId) => api.post(`/forums/replies/${replyId}/like/`),
  searchPosts: (params) => api.get('/forums/search/', { params }),
};

export default api;