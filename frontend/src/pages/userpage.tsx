// pages/userpage.tsx
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserPageContent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("用户");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("username");
      if (!saved) {
        router.push("/login");
      } else {
        setUsername(saved);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">个人中心</h1>
        <p><strong>用户名：</strong> {username}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(UserPageContent), { ssr: false });