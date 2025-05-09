import BlogUpdateForm from "@components/blog/BlogUpdateForm";
import { selectBlog } from "@lib/blog-db";

export default async function BlogEditPage({ params }) {
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  return <BlogUpdateForm post={post} />;
}
