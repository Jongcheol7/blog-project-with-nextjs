import Link from "next/link";
import { selectBlogs } from "../../lib/blog-db";
import BlogLists from "../../components/blog/blogLists";

export default async function BlogHomePage() {
  const posts = await selectBlogs();
  return (
    <div>
      <Link
        href="./blog-write"
        className="border rounded p-1 bg-yellow-300 text-red-500 float-right"
      >
        새글작성
      </Link>
      <BlogLists posts={posts} />
    </div>
  );
}
