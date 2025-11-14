// lib/api-client.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// 创建 axios 实例
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === 响应拦截器：统一错误处理（推荐保留）===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      '网络错误，请稍后重试';

    // 抛出结构化错误，方便 catch 捕获
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// === 类型定义 ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
    name?: string;
  };
  // 如果还有其他字段（如 message），也可以加
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

// === API 方法封装 ===
export const apiClient = {
  // 登录
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/login', data).then((res) => res.data),

  // 获取用户列表（示例）
  getUsers: (): Promise<unknown[]> =>
    api.get('/users').then((res) => res.data),

  // 通用方法
  get: <T>(url: string, params?: unknown): Promise<T> =>
    api.get(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown): Promise<T> =>
    api.post(url, data).then((res) => res.data),
};

export default apiClient;