// components/layout/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import { useState, useEffect } from "react";

export default function Navbar({ userRole = "user" }) {
  const [username, setUsername] = useState("用户");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 控制登录态
  const router = useRouter();

  // 仅在客户端执行
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("username");
      if (saved) {
        setUsername(saved);
        setIsLoggedIn(true);
      } else {
        setUsername("用户");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const navItems = [
    {path: "/articles", label: "阅读文章" },
    { path: "/extract", label: "信息提取" },
    { path: "/analyze", label: "数据分析" },
    {path: "/submit", label: "添加文章"}
  ];

  if (userRole === "admin") {
    navItems.push({ path: "/admin", label: "管理配置" });
  }

  const handleAuthClick = () => {
    if (isLoggedIn) {
      router.push("/userpage");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setUsername("请登录");
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white shadow-md border-b px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">学术信息提取与分析平台</h1>

      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <span
              className={`cursor-pointer px-3 py-1 rounded-md hover:bg-gray-100 ${
                router.pathname === item.path ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleAuthClick}
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          欢迎，{username}
        </button>
        {isLoggedIn && (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
            onClick={handleLogout}
          >
            退出
          </button>
        )}
      </div>
    </nav>
  );
}
