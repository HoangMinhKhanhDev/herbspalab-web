import API from './axios';

export const createOrder = (orderData: any) => 
  API.post('/orders', orderData);

export const getMyOrders = () => 
  API.get('/orders/myorders');

export const getOrderById = (id: string) => 
  API.get(`/orders/${id}`);

export const getAllOrders = () => 
  API.get('/orders');

export const updateOrderToPaid = (id: string) => 
  API.put(`/orders/${id}/pay`);

export const updateOrderToDelivered = (id: string) => 
  API.put(`/orders/${id}/deliver`);

export const updateOrderStatus = (id: string, status: string) => 
  API.put(`/orders/${id}/status`, { status });
