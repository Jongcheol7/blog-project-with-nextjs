import { selectBlog } from "@lib/blog-db";
import UserSession from "@lib/UserSession";
import BlogDetail from "@components/blog/BlogDetail";

export default async function BlogPostDetail({ params }) {
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  const user = await UserSession();

  return <BlogDetail post={post} user={user} />;
}
