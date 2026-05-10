import api from './axios';

export const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/orders${params ? `?${params}` : ''}`);
  return response.data;
};

export const updateOrderStatus = async (id, data) => {
  const response = await api.put(`/orders/${id}/status`, data);
  return response.data;
};