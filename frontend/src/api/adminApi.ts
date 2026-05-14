import API from './axios';

// Dashboard Stats
export const fetchAdminStats = () => API.get('/admin/stats');
export const getAdminStats = () => API.get('/admin/stats').then(res => res.data);
export const adminFetchSettings = () => API.get('/admin/settings').then(res => res.data);
export const adminUpdateSettings = (data: any) => API.put('/admin/settings', data);

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
export const adminFetchOrders = () => API.get('/orders');
export const getOrders = () => API.get('/orders').then(res => res.data);
export const getOrderDetail = (id: string) => API.get(`/orders/${id}`).then(res => res.data);
export const adminUpdateOrderStatus = (id: string, status: string) => API.put(`/orders/${id}/status`, { status });
export const updateOrderStatus = (id: string, status: string) => API.put(`/orders/${id}/status`, { status });
export const adminDeleteOrder = (id: string) => API.delete(`/orders/${id}`);

// Users (Admin)
export const adminFetchUsers = () => API.get('/users');
export const adminUpdateUserRole = (id: string, role: string) => API.put(`/users/${id}`, { role });
export const adminDeleteUser = (id: string) => API.delete(`/users/${id}`);

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
export const adminCreateAttribute = (data: { name: string, values?: string[] }) => API.post('/admin/attributes', data);
export const createAttribute = (data: { name: string, values?: string[] }) => API.post('/admin/attributes', data);
export const adminAddAttributeValue = (data: { attributeId: string, value: string }) => API.post('/admin/attributes/values', data);
export const addAttributeValue = (data: { attributeId: string, value: string }) => API.post('/admin/attributes/values', data);
export const adminDeleteAttribute = (id: string) => API.delete(`/admin/attributes/${id}`);
export const deleteAttribute = (id: string) => API.delete(`/admin/attributes/${id}`);
export const deleteAttributeValue = (id: string) => API.delete(`/admin/attributes/values/${id}`);

// Consultations (Admin)
export const adminFetchConsultations = (status?: string) => API.get('/consultations', { params: status ? { status } : {} });
export const adminDeleteConsultation = (id: string) => API.delete(`/consultations/${id}`);
export const updateConsultationStatus = (id: string, status: string) => API.put(`/consultations/${id}/status`, { status });

// Reports (Admin)
export const getTrafficReport = () => API.get('/admin/reports/traffic').then(res => res.data);
export const getCustomerReport = () => API.get('/admin/reports/customers').then(res => res.data);

// Blog (Admin)
export const adminFetchBlogs = () => API.get('/admin/blogs').then(res => res.data);
export const adminFetchBlogById = (id: string) => API.get(`/admin/blogs/${id}`).then(res => res.data);
export const adminCreateBlog = (data: any) => API.post('/blogs', data);
export const adminUpdateBlog = (id: string, data: any) => API.put(`/blogs/${id}`, data);
export const adminDeleteBlog = (id: string) => API.delete(`/blogs/${id}`);

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
