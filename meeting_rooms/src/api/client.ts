import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config:any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // СТАЛО (правильно: данные в теле запроса):
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  
  me: () => api.get('/auth/me'),
};

export const roomsApi = {
  getAll: () => api.get('/rooms'),
};

export const bookingsApi = {
  getAll: () => api.get('/bookings'),
  create: (data: any) => api.post('/bookings', data),
  update: (id: number, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
};