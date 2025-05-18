import { selectBlog } from "@lib/blog-db";
import UserSession from "@lib/UserSession";
import BlogDetail from "@components/blog/BlogDetail";
import BlogCommentsList from "@components/blog/BlogCommentsList";

export async function generateMetadata({ params }) {
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  console.log("메타데이터 파일 조회 : ", post);

  //1. 마크다운 문법 제거
  const plainContent = post.content
    .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 제거
    .replace(/\[.*?\]\(.*?\)/g, "") // 링크 제거
    .replace(/[#>*`_~\-]/g, "") // 마크다운 기호 제거
    .replace(/(\r\n|\n|\r)/gm, " ") // 줄바꿈 제거
    .replace(/\s+/g, " "); // 공백 정

  const summary = plainContent.slice(0, 100);
  console.log("요약본 : ", summary);
  return {
    title: post.title,
    description: summary,
    openGraph: {
      title: post.title,
      description: summary,
      images: [post.image_url],
    },
  };
}

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
