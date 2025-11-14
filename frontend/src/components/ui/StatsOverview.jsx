export default function StatsOverview({ data }) {
  if (!data.length) return <div>暂无数据</div>;

  const numeric = data.filter((d) => typeof d.value === "number");
  const values = numeric.map((n) => n.value);

  const stats = {
    count: data.length,
    numericCount: numeric.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: (values.reduce((s, v) => s + v, 0) / values.length).toFixed(2),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow p-6 border rounded-lg">
        <h5 className="font-semibold">总体统计</h5>
        <p>总数据点：{stats.count}</p>
        <p>数值数据点：{stats.numericCount}</p>
      </div>

      <div className="bg-white shadow p-6 border rounded-lg">
        <h5 className="font-semibold">数值范围</h5>
        <p>最小值：{stats.min}</p>
        <p>最大值：{stats.max}</p>
      </div>

      <div className="bg-white shadow p-6 border rounded-lg">
        <h5 className="font-semibold">平均值</h5>
        <p>{stats.avg}</p>
      </div>
    </div>
  );
}
