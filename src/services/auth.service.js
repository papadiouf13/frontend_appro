import api from './api';

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data.data;
  },

  logout: async (token) => {
    const res = await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data.data;
  },
};
