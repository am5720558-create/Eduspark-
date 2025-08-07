import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', userData),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (profileData: any) =>
    api.put('/auth/profile', profileData),
  
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', passwordData),
};

// Course API
export const courseAPI = {
  getCourses: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/courses${queryString ? `?${queryString}` : ''}`);
  },
  
  getCourse: (id: string) => api.get(`/courses/${id}`),
  
  createCourse: (courseData: any) => api.post('/courses', courseData),
  
  updateCourse: (id: string, courseData: any) =>
    api.put(`/courses/${id}`, courseData),
  
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),
  
  enrollInCourse: (id: string) => api.post(`/courses/${id}/enroll`),
  
  addReview: (id: string, reviewData: { rating: number; comment: string }) =>
    api.post(`/courses/${id}/review`, reviewData),
  
  getCategories: () => api.get('/courses/categories'),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/users'),
  
  getUser: (id: string) => api.get(`/users/${id}`),
};

// Progress API
export const progressAPI = {
  getProgress: (courseId: string) => api.get(`/progress/${courseId}`),
  
  markLessonComplete: (courseId: string, lessonId: string, timeSpent?: number) =>
    api.post(`/progress/${courseId}/lesson/${lessonId}`, { timeSpent }),
  
  submitQuiz: (courseId: string, lessonId: string, quizData: any) =>
    api.post(`/progress/${courseId}/quiz/${lessonId}`, quizData),
};

export default api;