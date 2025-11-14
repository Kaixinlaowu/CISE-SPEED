import Navbar from "@/components/layout/Navbar";
import AnalysisChart from "@/components/ui/AnalysisChart";
import AnalysisTable from "@/components/ui/AnalysisTable";
import StatsOverview from "@/components/ui/StatsOverview";
import { useState, useEffect } from "react";

export default function AnalyzePage() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("chart");

  useEffect(() => {
    fetch("/api/analysis/data")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">数据分析与可视化</h2>

        <select
          className="border px-4 py-2 rounded-lg mb-6"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="chart">图表视图</option>
          <option value="table">表格视图</option>
          <option value="stats">统计摘要</option>
        </select>

        {mode === "chart" && <AnalysisChart data={data} />}
        {mode === "table" && <AnalysisTable data={data} />}
        {mode === "stats" && <StatsOverview data={data} />}
      </div>
    </div>
  );
}
