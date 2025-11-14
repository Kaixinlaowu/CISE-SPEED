export default function AnalysisTable({ data }) {
  if (!data.length) return <div>暂无数据</div>;

  return (
    <table className="w-full bg-white shadow rounded-lg border overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 border">指标</th>
          <th className="p-3 border">值</th>
          <th className="p-3 border">单位</th>
          <th className="p-3 border">类别</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-3 border">{d.metric}</td>
            <td className="p-3 border">{d.value}</td>
            <td className="p-3 border">{d.unit || "N/A"}</td>
            <td className="p-3 border">{d.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
