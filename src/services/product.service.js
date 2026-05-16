import api from './api';

export const productService = {
  getAll: async () => {
    const res = await api.get('/products');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  getLowStock: async () => {
    const res = await api.get('/products/low-stock');
    return res.data.data;
  },

  getOutOfStock: async () => {
    const res = await api.get('/products/out-of-stock');
    return res.data.data;
  },
};
