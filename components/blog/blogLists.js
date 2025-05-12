import Image from "next/image";
import { useRouter } from "next/navigation";
import removeMd from "remove-markdown";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@store/UserStore";

export default function BlogLists({ posts }) {
  return (
    <ul>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <li key={post.post_no} className="mb-3">
            <Post post={post} />
          </li>
        ))
      )}
    </ul>
  );
}

function Post({ post }) {
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
  console.log("post", post);
  console.log("post.like_yn", post.like_yn);
  console.log("liked", liked);

  return (
    <div
      className="flex gap-4"
      onClick={() => {
        router.push(`/blog/${post.post_no}`);
      }}
    >
      <div className="w-[200px] h-[140px] relative flex-shrink-0">
        <Image
          src={`${post.image_url}?f_auto,q_auto` || "/placeholder-img.png"}
          alt={post.title || "No Image"}
          fill
          sizes="200px"
          priority
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-800 mb-1 mt-3">
              {post.title}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-2 break-all overflow-hidden">
              {contentPreview}
            </p>
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

          {/* ❤️ 좋아요 버튼 */}
          <button
            className={`group ml-3 mt-2 flex items-center gap-1 text-sm transition 
              ${
                liked === "Y"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-400"
              }`}
            onClick={(e) => {
              e.stopPropagation(); // 상위 div 클릭 방지
              if (!isUser) {
                alert("로그인 후 사용 가능합니다.");
                return;
              }
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

        <footer className="text-xs text-gray-500 mb-2">
          <span className="mr-5">
            {post.input_datetime.slice(0, 10)} | 조회수: {post.views}
          </span>
        </footer>
      </div>
    </div>
  );
}
