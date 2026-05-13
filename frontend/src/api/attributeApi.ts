import API from './axios';

export const fetchAttributes = () => API.get('/attributes');
export const createAttribute = (data: any) => API.post('/attributes', data);
export const addAttributeValue = (data: any) => API.post('/attributes/values', data);
export const deleteAttribute = (id: string) => API.delete(`/attributes/${id}`);
export const deleteAttributeValue = (id: string) => API.delete(`/attributes/values/${id}`);
