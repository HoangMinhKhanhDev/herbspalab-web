import API from './axios';

export const uploadFiles = (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadSingleFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
