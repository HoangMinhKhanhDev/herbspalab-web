import API from './axios';

export const fetchConsultations = () => API.get('/consultations');
export const createConsultation = (data: any) => API.post('/consultations', data);
export const deleteConsultation = (id: string) => API.delete(`/consultations/${id}`);
