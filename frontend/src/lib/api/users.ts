// src/lib/api/users.ts
import { api } from '../api-client';

export type User = {
  _id?: string;
  username: string;
  email?: string;
  // ...其他字段
};

export async function fetchUsers() {
  const res = await api.get<{ success: boolean; data: User[] }>('/users');
  // 根据后端返回格式调整：上面假设 { success, data }
  return res.data.data ?? res.data;
}

export async function fetchUserById(id: string) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function createUser(payload: Partial<User>) {
  const res = await api.post('/users', payload);
  return res.data;
}

export async function updateUser(id: string, payload: Partial<User>) {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
