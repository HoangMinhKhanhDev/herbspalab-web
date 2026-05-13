import API from './axios';

// Dashboard Stats
export const fetchAdminStats = () => API.get('/admin/stats');
export const getAdminStats = () => API.get('/admin/stats').then(res => res.data);

// Products (Admin)
export const adminFetchProducts = (params = {}) => API.get('/products', { params });
export const adminCreateProduct = (data: any) => API.post('/products', data);
export const adminUpdateProduct = (id: string, data: any) => API.put(`/products/${id}`, data);
export const adminDeleteProduct = (id: string) => API.delete(`/products/${id}`);
export const adminExportCSV = () => API.get('/products/export/csv', { responseType: 'blob' });
export const adminImportCSV = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/products/import/csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// Orders (Admin)
export const adminFetchOrders = () => API.get('/admin/orders');
export const getOrders = () => API.get('/admin/orders').then(res => res.data);
export const adminUpdateOrderStatus = (id: string, status: string) => API.put(`/admin/orders/${id}/status`, { status });
export const updateOrderStatus = (id: string, status: string) => API.put(`/admin/orders/${id}/status`, { status });
export const adminDeleteOrder = (id: string) => API.delete(`/admin/orders/${id}`);

// Users (Admin)
export const adminFetchUsers = () => API.get('/admin/users');
export const adminUpdateUserRole = (id: string, role: string) => API.put(`/admin/users/${id}`, { role });
export const adminDeleteUser = (id: string) => API.delete(`/admin/users/${id}`);

// Categories (Admin)
export const adminFetchCategories = () => API.get('/admin/categories');
export const getCategories = () => API.get('/admin/categories').then(res => res.data);
export const adminCreateCategory = (data: any) => API.post('/admin/categories', data);
export const createCategory = (data: any) => API.post('/admin/categories', data);
export const adminUpdateCategory = (id: string, data: any) => API.put(`/admin/categories/${id}`, data);
export const updateCategory = (id: string, data: any) => API.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id: string) => API.delete(`/admin/categories/${id}`);
export const deleteCategory = (id: string) => API.delete(`/admin/categories/${id}`);

// Attributes (Admin)
export const adminFetchAttributes = () => API.get('/admin/attributes');
export const getAttributes = () => API.get('/admin/attributes').then(res => res.data);
export const adminCreateAttribute = (data: { name: string }) => API.post('/admin/attributes', data);
export const createAttribute = (data: { name: string }) => API.post('/admin/attributes', data);
export const adminAddAttributeValue = (data: { attributeId: string, value: string }) => API.post('/admin/attributes/values', data);
export const addAttributeValue = (data: { attributeId: string, value: string }) => API.post('/admin/attributes/values', data);
export const adminDeleteAttribute = (id: string) => API.delete(`/admin/attributes/${id}`);
export const deleteAttribute = (id: string) => API.delete(`/admin/attributes/${id}`);
export const deleteAttributeValue = (id: string) => API.delete(`/admin/attributes/values/${id}`);

// Consultations (Admin)
export const adminFetchConsultations = () => API.get('/admin/consultations');
export const adminDeleteConsultation = (id: string) => API.delete(`/admin/consultations/${id}`);

// Blog (Admin)
export const adminFetchBlogs = () => API.get('/admin/blogs');
export const adminCreateBlog = (data: any) => API.post('/admin/blogs', data);
export const adminUpdateBlog = (id: string, data: any) => API.put(`/admin/blogs/${id}`, data);
export const adminDeleteBlog = (id: string) => API.delete(`/admin/blogs/${id}`);

// Upload (Admin)
export const adminUploadSingle = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/upload/single', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const adminUploadMultiple = (files: FileList | File[]) => {
  const form = new FormData();
  Array.from(files).forEach(file => form.append('files', file));
  return API.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
