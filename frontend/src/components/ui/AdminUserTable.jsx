export default function AdminUserTable({ users }) {
  return (
    <div className="bg-white shadow p-6 rounded-lg border">
      <h3 className="font-bold mb-4">用户管理</h3>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">用户名</th>
            <th className="p-3 border">角色</th>
            <th className="p-3 border">操作</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-3">{u.username}</td>
              <td className="border p-3">{u.role}</td>
              <td className="border p-3 space-x-3">
                <button className="text-blue-600 hover:underline">编辑</button>
                <button className="text-red-600 hover:underline">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
