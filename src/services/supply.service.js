import api from './api';

export const supplyService = {
  getAll: async () => {
    const res = await api.get('/supplies');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/supplies/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post('/supplies', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/supplies/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/supplies/${id}`);
    return res.data;
  },
};
