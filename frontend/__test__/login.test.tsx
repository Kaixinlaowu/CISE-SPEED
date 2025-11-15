// frontend/__tests__/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/pages/login';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/router';
import { describe, it } from 'node:test';

jest.mock('@/lib/api-client');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login Page', () => {
  const push = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    localStorage.clear();
  });

  it('should login successfully', async () => {
    (apiClient.login as jest.Mock).mockResolvedValue({
      user: { username: 'admin' },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('请输入用户名'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入密码'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('立即登录'));

    await waitFor(() => {
      expect(localStorage.getItem('username')).toBe('admin');
      expect(push).toHaveBeenCalledWith('/');
    });
  });
});
