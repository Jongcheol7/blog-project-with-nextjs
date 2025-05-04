import Image from "next/image";
import Link from "next/link";
import { selectBlog } from "../../../lib/blog-db";
import ReactMarkdown from "react-markdown";
import DeleteButton from "../../../components/blog/DeleteButton";

export default async function BlogPostDetail({ params }) {
  const { postNo } = await params;
  const post = await selectBlog(postNo);
  console.log(post);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <DeleteButton postNo={post.POST_NO} />

      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-2">{post.TITLE}</h1>

      {/* 날짜 & 조회수 */}
      <div className="text-sm text-gray-500 mb-6">
        {post.INPUT_DATETIME?.slice(0, 10)} · 조회수 {post.VIEWS}
      </div>

      {/* 썸네일 */}
      {typeof post.IMAGE_URL === "string" && post.IMAGE_URL.trim() !== "" ? (
        <div className="relative w-full h-[400px] mb-6">
          <Image
            src={`${post.IMAGE_URL}?f_auto,q_auto`}
            alt={post.TITLE || "No Image"}
            fill
            sizes="100vw"
            className="object-cover rounded-md"
            priority
          />
        </div>
      ) : null}

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.TAGS?.split(",").map((tag) => (
          <span
            key={tag}
            className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 본문 내용 */}
      {/* ✨ 마크다운 렌더링 */}
      <ReactMarkdown
        components={{
          img({ node, ...props }) {
            if (!props.src?.trim()) return null; // src가 빈 문자열이면 렌더링 안함
            return <img {...props} alt={props.alt || "이미지"} />;
          },
        }}
      >
        {post.CONTENT}
      </ReactMarkdown>

      {/* 뒤로가기 */}
      <div className="mt-10">
        <Link href="/blog" className="text-sm text-green-700 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
