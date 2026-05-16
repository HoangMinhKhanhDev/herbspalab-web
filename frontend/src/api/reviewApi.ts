import API from './axios';

export const fetchReviews = (productId: string) => 
  API.get(`/products/${productId}/reviews`);

export const createReview = (productId: string, data: { rating: number; comment: string }) => 
  API.post(`/products/${productId}/reviews`, data);
