// components/layout/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar({ userRole = "user" }) {
  const router = useRouter();

  const navItems = [
    { path: "/search", label: "文章搜索" },
    { path: "/extract", label: "信息提取" },
    { path: "/analyze", label: "数据分析" },
  ];

  if (userRole === "admin") {
    navItems.push({ path: "/admin", label: "管理配置" });
  }

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

      <div>
        <button
          onClick={() => router.push("/login")}
          className="text-gray-700 hover:text-gray-900 mr-3"
        >
          欢迎用户 ({userRole})
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
        >
          退出
        </button>
      </div>
    </nav>
  );
}
