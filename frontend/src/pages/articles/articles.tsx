// frontend/pages/articles.tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // === 加载文章 ===
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<Article[]>("/articles");
        setArticles(data);
        setFilteredArticles(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || "加载文章失败");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);


  // === 实时搜索（防抖）===
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredArticles(articles);
        return;
      }

      const lowerTerm = searchTerm.toLowerCase();
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerTerm) ||
          article.author.toLowerCase().includes(lowerTerm) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerTerm))
      );
      setFilteredArticles(filtered);
    }, 300); // 300ms 防抖

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, articles]);

  // === 删除逻辑 ===
  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      setDeletingId(articleToDelete._id);
      await apiClient.delete(`/articles/${articleToDelete._id}`);
      const updated = articles.filter((a) => a._id !== articleToDelete._id);
      setArticles(updated);
      setFilteredArticles(updated);
      setShowConfirm(false);
      setArticleToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err?.message || "删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (article: Article) => {
    setArticleToDelete(article);
    setShowConfirm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        {/* 标题 + 搜索 + 写文章 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">所有文章</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* 搜索框 */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索标题、作者、标签..."
                className="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 写文章按钮 */}
            <Link
              href="/submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md whitespace-nowrap"
            >
              写文章
            </Link>
          </div>
        </div>

        {/* 加载中 */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* 空结果 */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-4">
              {searchTerm ? `未找到包含 “${searchTerm}” 的文章` : "暂无文章"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-indigo-600 hover:underline font-medium"
              >
                清除搜索
              </button>
            )}
            {!searchTerm && (
              <Link href="/submit" className="text-indigo-600 hover:underline font-medium">
                成为第一个作者
              </Link>
            )}
          </div>
        )}

        {/* 文章网格 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <div key={article._id} className="relative group">
              <Link href={`/articles/${article._id}`} className="block">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="font-medium text-indigo-600">{article.author}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-400">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
              </Link>

              {/* 删除按钮 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirmDelete(article);
                }}
                disabled={deletingId === article._id}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50"
                title="删除文章"
              >
                {deletingId === article._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 确认删除弹窗 */}
      {showConfirm && articleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">确认删除文章？</h3>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">《{articleToDelete.title}》</span>
              <br />
              <span className="text-sm">作者：{articleToDelete.author}</span>
            </p>
            <p className="text-sm text-red-600 mb-6">此操作不可撤销！</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setArticleToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deletingId ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
