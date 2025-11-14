import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function SearchForm({ onResult }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await apiClient.searchArticles({ query, limit: 10, offset: 0 });
    onResult(result);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-3">
      <input
        type="text"
        className="border rounded-lg px-4 py-2 w-96"
        placeholder="输入关键词、DOI或文章标题..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "搜索中..." : "搜索"}
      </button>
    </form>
  );
}
