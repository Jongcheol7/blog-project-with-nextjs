import Link from "next/link";
import { selectBlogs } from "../../lib/blog-db";
import BlogLists from "../../components/blog/blogLists";

export default async function BlogHomePage() {
  const posts = await selectBlogs();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* max-w-4xl: 폭 제한, mx-auto: 가운데 정렬, padding 추가 */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 블로그 목록</h1>
        <Link
          href="./blog-write"
          className="border border-red-400 rounded px-3 py-1 bg-yellow-200 text-red-600 text-sm font-medium hover:bg-yellow-300"
        >
          ✍ 새글 작성
        </Link>
      </div>

      <BlogLists posts={posts} />
    </div>
  );
}
