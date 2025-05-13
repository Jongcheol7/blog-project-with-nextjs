import { selectBlog } from "@lib/blog-db";
import UserSession from "@lib/UserSession";
import BlogDetail from "@components/blog/BlogDetail";
import BlogComments from "@components/blog/BlogComments";

export default async function BlogPostDetail({ params }) {
  console.log("블로그 디테일 페이지");
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  const user = await UserSession();

  return (
    <>
      <BlogDetail post={post} user={user} />
      <BlogComments postNo={postNo} user={user} />
    </>
  );
}
