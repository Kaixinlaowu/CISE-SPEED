// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await apiClient.login({ username, password });

    // 关键：存 username 到 localStorage
    localStorage.setItem("username", res.user.username);
    localStorage.setItem("userRole", "user"); // 你目前无 role，可写死

    router.push("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err?.message || "用户名或密码错误");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">欢迎登录</h1>
            <p className="text-gray-500 mt-2">请输入您的账号信息</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="请输入密码"
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
                  登录中...
                </span>
              ) : (
                "立即登录"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            没有账号？{" "}
            <Link href="/register" className="text-indigo-600 hover:underline font-medium">
              立即注册
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 YourApp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
