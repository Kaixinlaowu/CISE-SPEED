// frontend/pages/submit.tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import dynamic from "next/dynamic";

// === 动态导入 Tiptap，避免 SSR ===
const Tiptap = dynamic(
  async () => {
    const { useEditor, EditorContent } = await import("@tiptap/react");
    const StarterKit = (await import("@tiptap/starter-kit")).default;

    return function TiptapComponent({ value, onChange }: { value: string; onChange: (v: string) => void }) {
      const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
          onChange(editor.getHTML());
        },
        editorProps: {
          attributes: {
            class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-96 p-4",
          },
        },
      });

      if (!editor) return null;

      return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <EditorContent editor={editor} />
        </div>
      );
    };
  },
  {
    ssr: false,
    loading: () => <p className="text-gray-500">加载编辑器...</p>,
  }
);

// === 表单校验 ===
const schema = z.object({
  title: z.string().min(1, "标题必填"),
  content: z.string().min(10, "内容至少10字"),
  category: z.string().min(1, "请选择分类"),
  tags: z.string().optional(),
  author: z.string().min(1, "作者必填"),
});

type FormData = z.infer<typeof schema>;

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      author: "",
      tags: "",
    },
  });

  const content = watch("content");

  // === 检查登录状态：未登录跳转到登录页 ===
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/login");
    }
  }, [router]);

  // === 提交逻辑 ===
 // frontend/pages/submit.tsx → onSubmit
const onSubmit = async (data: FormData) => {
  setError("");
  setLoading(true);

  try {
    await apiClient.createArticle({  // 改用 createArticle！
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      author: data.author,
    });

    router.push("/articles");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err?.message || "提交失败，请重试");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">发布新文章</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章标题
            </label>
            <input
              {...register("title")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="输入文章标题"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章分类
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">请选择分类</option>
              <option value="技术">技术</option>
              <option value="生活">生活</option>
              <option value="学习">学习</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签（逗号分隔）
            </label>
            <input
              {...register("tags")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="React, Next.js, 前端"
            />
          </div>

          {/* 作者：任意输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作者（可使用笔名）
            </label>
            <input
              {...register("author")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="如：张三、AI助手、匿名"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
            )}
          </div>

          {/* 内容 - Tiptap 富文本 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章内容
            </label>
            <div className="h-96 mb-4">
              <Tiptap value={content || ""} onChange={(v) => setValue("content", v)} />
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              }`}
            >
              {loading ? "提交中..." : "发布文章"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}