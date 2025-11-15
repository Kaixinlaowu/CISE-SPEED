// pages/register.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router"; // Pages Router
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 前端校验
    if (!username || !password || !confirmPassword) {
      setError("所有字段都必填");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("密码至少6位");
      setLoading(false);
      return;
    }

    try {
      // 1. 调用注册接口
      await apiClient.post("/auth/register", {
        username,
        password,
      });

      // 2. 注册成功 → 自动登录
      const loginRes = await apiClient.login({ username, password });

      // 3. 存储登录态
      localStorage.setItem("username", loginRes.user.username);
      localStorage.setItem("userRole", "user");

      // 4. 跳转首页
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "注册失败，请检查用户名是否已存在");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">创建账号</h1>
            <p className="text-gray-500 mt-2">请填写以下信息完成注册</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* 用户名输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="请输入用户名"
              />
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="请输入密码（至少6位）"
              />
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="请再次输入密码"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm animate-pulse">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  注册中...
                </span>
              ) : (
                "立即注册"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            已有账号？{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              立即登录
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 SPEED. All rights reserved.
        </p>
      </div>
    </div>
  );
}