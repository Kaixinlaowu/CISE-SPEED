import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/search"); // 默认跳转到搜索页面
  }, [router]);

  return <div>Loading...</div>;
}
