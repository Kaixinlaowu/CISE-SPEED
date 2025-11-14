export default function AdminConfig({ config, setConfig }) {
  const handleSave = async () => {
    await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    alert("配置已更新！");
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg border">
      <h3 className="font-bold mb-4">系统配置</h3>

      <div className="text-gray-600 mb-4">（这里可以加入配置表单）</div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        保存配置
      </button>
    </div>
  );
}
