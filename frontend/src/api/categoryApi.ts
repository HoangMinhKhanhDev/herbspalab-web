import API from './axios';

export const fetchCategories = () => API.get('/categories');
export const fetchCategoryBySlug = (slug: string) => API.get(`/categories/slug/${slug}`);
export const createCategory = (data: any) => API.post('/categories', data);
export const updateCategory = (id: string, data: any) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => API.delete(`/categories/${id}`);
