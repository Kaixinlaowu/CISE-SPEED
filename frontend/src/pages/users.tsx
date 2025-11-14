// src/pages/users.tsx
import { useEffect, useState } from "react";
import { fetchUsers, createUser, type User } from "../lib/api/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e: unknown) {
      // 改为 unknown 或 any
      // 类型安全的错误处理
      if (e instanceof Error) {
        setErr(e.message || "Failed to load");
      } else if (typeof e === "object" && e !== null && "response" in e) {
        // 处理 axios 错误响应
        const axiosError = e as { response?: { data?: { message?: string } } };
        setErr(axiosError.response?.data?.message || "Failed to load");
      } else {
        setErr("Failed to load");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const username = prompt("Username");
    if (!username) return;
    try {
      await createUser({ username });
      await load(); // 重新加载列表
    } catch (e) {
      alert("Create failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Users</h1>
      <button
        onClick={handleCreate}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Create user
      </button>

      {loading && <p>Loading...</p>}
      {err && <p className="text-red-600">{err}</p>}

      <ul className="mt-4 space-y-2">
        {users.map((u) => (
          <li key={u._id} className="p-3 bg-white rounded shadow">
            <div className="font-medium">{u.username}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
