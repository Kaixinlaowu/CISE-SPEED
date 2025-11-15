// frontend/lib/api-client.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || '网络错误';
    return Promise.reject({ message, status: err.response?.status });
  }
);

export const apiClient = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data).then(res => res.data),

  createArticle: (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    author: string;
  }) => api.post('/articles', data).then(res => res.data),

  delete: <T>(url: string): Promise<T> =>
    api.delete(url).then(res => res.data),

  get: <T>(url: string, params?: unknown): Promise<T> =>
    api.get(url, { params }).then(res => res.data),
};