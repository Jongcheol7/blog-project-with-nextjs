import { selectBlog } from "@lib/blog-db";
import UserSession from "@lib/UserSession";
import BlogDetail from "@components/blog/BlogDetail";
import BlogCommentsList from "@components/blog/BlogCommentsList";

export default async function BlogPostDetail({ params }) {
  console.log("블로그 디테일 페이지");
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  const user = await UserSession();

  return (
    <div className="max-w-250 mx-auto mt-10 px-4">
      <BlogDetail post={post} user={user} />
      <BlogCommentsList postNo={postNo} user={user} />
    </div>
  );
}
