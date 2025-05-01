import Link from "next/link";
import { selectBlogs } from "../../lib/blog-db";

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
      <ul>
        {posts.map((post) => (
          <li key={post.POST_NO}>{post.TITLE}</li>
        ))}
      </ul>
    </div>
  );
}
