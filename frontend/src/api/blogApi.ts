import API from './axios';

// Public Blog API Endpoints
export const fetchBlogs = () => API.get('/blogs').then(res => res.data);
export const fetchBlogBySlug = (slug: string) => API.get(`/blogs/${slug}`).then(res => res.data);
export const addBlogComment = (blogId: string, data: { name: string, email: string, avatar?: string, content: string }) => API.post(`/blogs/${blogId}/comments`, data).then(res => res.data);
