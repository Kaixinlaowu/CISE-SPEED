import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function ExtractionInput({ onExtractFinished }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const result = await apiClient.extractInfo({ text });
      onExtractFinished?.(result); // 将结果传给父组件
    } catch (e) {
      console.error("Extraction failed:", e);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <textarea
        className="w-full border rounded-md p-3 h-40"
        placeholder="Paste your text for extraction..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleExtract}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? "Extracting..." : "Extract"}
      </button>
    </div>
  );
}
