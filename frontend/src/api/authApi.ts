import API from './axios';

export const login = (credentials: any) => 
  API.post('/users/login', credentials);

export const register = (userData: any) => 
  API.post('/users/register', userData);

export const getProfile = () => 
  API.get('/users/profile');

export const logout = () =>
  API.post('/users/logout');
