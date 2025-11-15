import Navbar from "@/components/layout/Navbar";
import SearchForm from "@/components/ui/SearchForm";
import ArticleList from "@/components/ui/ArticleList";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">寻找合适的文章</h2>

        <SearchForm />
        <ArticleList />
      </div>
    </div>
  );
}
