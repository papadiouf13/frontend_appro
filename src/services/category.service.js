import api from './api';

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};
