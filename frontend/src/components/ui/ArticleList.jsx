import { useState } from "react";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  const updateResults = (data) => {
    setArticles(data.articles || []);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">搜索结果</h3>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="p-4 bg-white shadow rounded-lg border">
            <h4 className="font-semibold text-blue-700">{article.title}</h4>
            <p className="text-sm text-gray-600">{article.authors.join(", ")}</p>
            <p className="text-sm">{article.journal} - {article.year}</p>
            <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded">
              提取信息
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
