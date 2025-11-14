import Navbar from "@/components/layout/Navbar";
import AdminConfig from "@/components/ui/AdminConfig";
import AdminUserTable from "@/components/ui/AdminUserTable";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [config, setConfig] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/config").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ]).then(([configData, usersData]) => {
      setConfig(configData);
      setUsers(usersData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" />

      <div className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">管理员控制面板</h2>

        <div className="space-y-10">
          <AdminConfig config={config} setConfig={setConfig} />
          <AdminUserTable users={users} />
        </div>
      </div>
    </div>
  );
}
