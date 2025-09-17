// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.login({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('userRole', res.user.role);
      router.push('/');
    } catch (err: unknown) {
        console.log(err+"login error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>邮箱：</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>密码：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
}