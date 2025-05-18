"use client";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";

export default function BlogDetail({ post, user }) {
  useEffect(() => {
    async function increaseViews() {
      const cookieKey = `viewed_${post.post_no}`;
      const alreadyViewed = document.cookie.includes(`${cookieKey}=true`);
      console.log("cookieKey : ", cookieKey);
      console.log("alreadyViewed : ", alreadyViewed);
      if (!alreadyViewed) {
        // 조회수 증가 api 호출
        await fetch("/api/blog/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postNo: post.post_no }),
          cache: "no-store", // 캐시 방지
        });

        // 쿠키 저장
        document.cookie = `${cookieKey}=true; max-age=10; path=/`;
      }
    }
    increaseViews();
  }, [post.post_no]);

  return (
    <div className="">
      {/* 뒤로가기 */}
      <div className="mt-10 flex gap-2 justify-end">
        {/* 목록으로 돌아가기 버튼 */}
        <Link
          href="/blog"
          className="bg-yellow-100 border border-red-400 text-red-600 text-sm px-2 py-1 rounded hover:bg-yellow-200 transition"
        >
          ← 목록으로
        </Link>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("링크가 복사되었습니다!");
          }}
          className="bg-yellow-100 border border-red-400 text-red-600 text-sm px-2 py-1 rounded hover:bg-yellow-200 transition"
        >
          🔗 링크 복사
        </button>
        {/* 수정, 삭제 버튼 */}
        {post.user_id === user?.id && (
          <>
            <Link
              href={`/blog/${post.post_no}/edit`}
              className="bg-yellow-100 border border-red-400 text-red-600 text-sm px-2 py-1 rounded hover:bg-yellow-200 transition"
            >
              수정
            </Link>
            <DeleteButton postNo={post.post_no} />
          </>
        )}
      </div>
      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {/* 날짜 & 조회수 */}
      <div className="text-sm text-gray-500 mb-6">
        {post.input_datetime?.slice(0, 10)} · 조회수 {post.views}
      </div>

      {/* 썸네일 
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
       */}

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags?.split(",").map((tag) => (
          <span
            key={tag}
            className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 본문 내용 */}
      {/* 마크다운 렌더링 */}
      <ReactMarkdown
        components={{
          img({ node, ...props }) {
            if (!props.src?.trim()) return null; // src가 빈 문자열이면 렌더링 안함
            return <img {...props} alt={props.alt || "이미지"} />;
          },
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}
