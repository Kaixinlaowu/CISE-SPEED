
export default function ExtractionResult() {
  const { extractionData, saveToDatabase, loading } = useExtractionStore();

  if (!extractionData) {
    return (
      <div className="bg-white shadow p-6 rounded-lg border flex items-center justify-center text-gray-500">
        暂无提取结果
      </div>
    );
  }

  return (
    <div className="bg-white shadow p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">提取的信息</h3>

      <div className="space-y-3">
        {extractionData.extractedData?.keyFigures?.map((item, i) => (
          <div key={i} className="p-3 border rounded-lg bg-gray-50">
            <strong>{item.label}：</strong>
            {item.value}
            {item.type === "percentage" ? "%" : ""}
          </div>
        ))}
      </div>

      <button
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        onClick={saveToDatabase}
        disabled={loading}
      >
        {loading ? "保存中..." : "保存到SPEED数据库"}
      </button>
    </div>
  );
}
