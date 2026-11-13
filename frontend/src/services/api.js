import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cmpro_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for 401 token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cmpro_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/token/refresh/', { refresh: refreshToken });
          const newAccess = res.data.access;
          localStorage.setItem('cmpro_access_token', newAccess);
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('cmpro_access_token');
          localStorage.removeItem('cmpro_refresh_token');
          localStorage.removeItem('cmpro_user');
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authApi = {
  register: (data) => api.post('/api/auth/register/', data),
  login: (data) => api.post('/api/auth/login/', data),
  getProfile: () => api.get('/api/auth/profile/'),
  updateProfile: (data) => api.patch('/api/auth/profile/', data),
  changePassword: (data) => api.post('/api/auth/change-password/', data),
};

export const subscriptionApi = {
  getPlans: () => api.get('/api/subscriptions/plans/'),
  getMySubscription: () => api.get('/api/subscriptions/my-subscription/'),
};

export const paymentApi = {
  getSettings: () => api.get('/api/payments/settings/'),
  generateQr: (plan_id) => api.post('/api/payments/generate-qr/', { plan_id }),
  submitPayment: (formData) => api.post('/api/payments/submit/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyHistory: () => api.get('/api/payments/my-history/'),
};

export const calculatorApi = {
  getHistory: (params) => api.get('/api/calculators/history/', { params }),
  saveHistory: (data) => api.post('/api/calculators/history/', data),
  clearHistory: () => api.delete('/api/calculators/history/clear/'),
  getFavorites: () => api.get('/api/calculators/favorites/'),
  toggleFavorite: (data) => api.post('/api/calculators/favorites/', data),
  getSaved: () => api.get('/api/calculators/saved/'),
  createSaved: (data) => api.post('/api/calculators/saved/', data),
  deleteSaved: (id) => api.delete(`/api/calculators/saved/${id}/`),
  exportCsv: () => api.get('/api/calculators/history/export-csv/', { responseType: 'blob' }),
  exportPdf: () => api.get('/api/calculators/history/export-pdf/', { responseType: 'blob' }),
};

export const aiApi = {
  explainCalculation: (data) => api.post('/api/ai/explain/', data),
};

export const adminApi = {
  getOverview: () => api.get('/api/analytics/admin/overview/'),
  getUsers: (params) => api.get('/api/auth/admin/users/', { params }),
  performUserAction: (userId, action, extra = {}) => api.post(`/api/auth/admin/users/${userId}/action/`, { action, ...extra }),
  getPlans: () => api.get('/api/subscriptions/admin/plans/'),
  createPlan: (data) => api.post('/api/subscriptions/admin/plans/', data),
  updatePlan: (id, data) => api.patch(`/api/subscriptions/admin/plans/${id}/`, data),
  getRequests: (params) => api.get('/api/payments/admin/requests/', { params }),
  makePaymentDecision: (id, decision, rejection_reason = '') => api.post(`/api/payments/admin/requests/${id}/decision/`, { decision, rejection_reason }),
  getSettings: () => api.get('/api/payments/admin/settings/'),
  updateSettings: (data) => api.patch('/api/payments/admin/settings/', data),
  getLogs: (params) => api.get('/api/audit/admin/logs/', { params }),
  exportRevenueCsv: () => api.get('/api/analytics/admin/export-revenue/', { responseType: 'blob' }),
};

export default api;
