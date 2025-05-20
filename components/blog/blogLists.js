import Image from "next/image";
import { useRouter } from "next/navigation";
import removeMd from "remove-markdown";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@store/UserStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogLists({ posts, isMobile }) {
  return posts.length === 0 ? (
    <p className="text-gray-500 text-sm">게시글이 없습니다.</p>
  ) : (
    posts.map((post) => (
      <Post key={post.post_no} post={post} isMobile={isMobile} />
    ))
  );
}

function Post({ post, isMobile }) {
  // Link 처럼 페이지 이동하는 hook
  const router = useRouter();
  // content에 마크다운을 제거 하는 기능..
  // 글내용에 이미지가 있다면 이미지 소스를 그대로 문자열로 보여주는 현상
  const contentPreview = removeMd(post.content).slice(0, 100);
  const [liked, setLiked] = useState(post.like_yn);
  const { user } = useUserStore();
  const isUser = user === null ? false : true;

  useEffect(() => {
    setLiked(post.like_yn);
  }, [post.like_yn]);

  // 좋아요 업데이트 함수
  const handleLikeUpdate = async () => {
    try {
      const res = await fetch("/api/blog/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postNo: post.post_no, userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("data.liked", data.liked);
        setLiked(data.liked === "N" ? "N" : "Y");
      } else {
        alert("좋아요 실패");
      }
    } catch (err) {
      console.log("좋아요 요청 실패", err);
    }
  };

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col border-b border-gray-300 py-4 gap-2"
          : "flex gap-4 border-b border-gray-300 py-4"
      } hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer`}
      onClick={() => {
        if (post.private_yn === "Y" && !isUser) {
          alert("비밀글 입니다. 로그인한 사람만 볼 수 있습니다.");
        } else {
          router.push(`/blog/${post.post_no}`);
        }
      }}
    >
      {/* 이미지 */}
      <div
        className={`relative ${
          isMobile ? "w-full h-[180px]" : "w-[200px] h-[140px] flex-shrink-0"
        }`}
      >
        <Image
          src={post.image_url || "/placeholder-img.png"}
          alt={post.title || "No Image"}
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          priority
          className="object-cover rounded-md"
        />
      </div>

      {/* 내용 */}
      <div className="flex-1 flex flex-col justify-between min-w-[150px]">
        {/* 상단: 제목 + 내용 + 태그 */}
        <div>
          {/* 제목 */}
          <div className="flex items-center mb-1 mt-2">
            <h2 className="text-base font-semibold text-gray-800 mr-2">
              {post.title}
            </h2>
            {post.private_yn === "Y" && <span>🔒</span>}
          </div>

          {/* 내용 미리보기 */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: (props) => (
                <p
                  className="text-sm text-gray-600 line-clamp-2 break-all"
                  {...props}
                />
              ),
            }}
          >
            {contentPreview}
          </ReactMarkdown>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags?.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 하단: 좋아요 + 날짜 */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            {post.input_datetime.slice(0, 10)} | 조회수: {post.views}
          </span>
        </div>
      </div>

      {/* 좋아요 버튼 (PC에서만 우측에 붙임, 모바일에서는 하단에 정렬될 것) */}
      <button
        className={`group flex items-center gap-1 text-sm transition min-w-20 ${
          liked === "Y" ? "text-red-500" : "text-gray-400 hover:text-red-400"
        } ${isMobile ? "mt-3 self-start" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isUser) return alert("로그인 후 사용 가능합니다.");
          handleLikeUpdate();
        }}
      >
        <Heart
          className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            liked === "Y" ? "fill-red-500" : "fill-none"
          }`}
        />
        {liked === "Y" ? "좋아요!" : "좋아요"}
      </button>
    </div>
  );
}
