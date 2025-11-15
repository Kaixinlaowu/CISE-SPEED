// frontend/pages/articles/[id].tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import { apiClient } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ArticleDetail {
  _id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  content: string;          // 假设后端返回的完整 markdown / html
  createdAt: string;
  updatedAt?: string;
}

export default function ArticleDetailPage() {
  const { id } = useParams();               // Next.js 13+ App Router 用 useParams
  const router = useRouter();

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<ArticleDetail>(`/articles/${id}`);
        setArticle(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || "加载文章失败");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-xl text-red-600 mb-4">{error || "文章不存在"}</p>
          <button
            onClick={() => router.push("/articles")}
            className="text-indigo-600 hover:underline"
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <article className="container mx-auto px-6 py-10 max-w-4xl">
        {/* 标题 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 gap-4">
          <span className="font-medium text-indigo-600">{article.author}</span>
          <span>•</span>
          <span>{article.category}</span>
          <span>•</span>
          <time>{formatDate(article.createdAt)}</time>
          {article.updatedAt && article.createdAt !== article.updatedAt && (
            <>
              <span>•</span>
              <span className="text-gray-500">更新于 {formatDate(article.updatedAt)}</span>
            </>
          )}
        </div>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
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

        {/* 文章内容 – 支持 Markdown / HTML */}
        <div
          className="prose prose-lg max-w-none prose-indigo
                     prose-headings:font-semibold prose-headings:text-gray-800
                     prose-a:text-indigo-600 prose-a:underline hover:prose-a:text-indigo-800
                     prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50
                     prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 返回按钮 */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </Link>

          {/* 可选：编辑按钮（仅作者或管理员） */}
          {/* <Link href={`/submit?id=${article._id}`} className="text-sm text-gray-500 hover:underline">
            编辑
          </Link> */}
        </div>
      </article>
    </div>
  );
}