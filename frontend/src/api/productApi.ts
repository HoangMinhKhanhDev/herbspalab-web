import API from './axios';

export const fetchProducts = (params = {}) => 
  API.get('/products', { params });

export const fetchProductById = (id: string) => 
  API.get(`/products/${id}`);

export const fetchProductBySlug = (slug: string) => 
  API.get(`/products/${slug}`);

export const createProduct = (productData: any) => 
  API.post('/products', productData);

export const updateProduct = (id: string, productData: any) => 
  API.put(`/products/${id}`, productData);

export const deleteProduct = (id: string) => 
  API.delete(`/products/${id}`);

export const exportProductsCSV = () => 
  API.get('/products/export/csv', { responseType: 'blob' });

export const importProductsCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/products/import/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const duplicateProduct = (id: string) => API.post(`/products/${id}/duplicate`);
export const bulkUpdateProducts = (updates: any[]) => API.patch('/products/bulk-update', { updates });

export const getProductDetails = (id: string) => 
  API.get(`/products/${id}`).then(res => res.data);
