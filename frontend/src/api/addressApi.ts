import API from './axios';

export const getAddresses = () => API.get('/users/addresses');
export const addAddress = (data: any) => API.post('/users/addresses', data);
export const updateAddress = (id: string, data: any) => API.put(`/users/addresses/${id}`, data);
export const deleteAddress = (id: string) => API.delete(`/users/addresses/${id}`);
export const setDefaultAddress = (id: string) => API.put(`/users/addresses/${id}/default`);
