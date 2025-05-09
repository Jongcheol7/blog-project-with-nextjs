import Image from "next/image";
import { useRouter } from "next/navigation";
import removeMd from "remove-markdown";

export default function BlogLists({ posts }) {
  return (
    <ul>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <li key={post.POST_NO} className="mb-3">
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
  const contentPreview = removeMd(post.CONTENT).slice(0, 100);
  return (
    <div
      className="flex gap-4"
      onClick={() => {
        router.push(`/blog/${post.POST_NO}`);
      }}
    >
      <div className="w-[200px] h-[140px] relative flex-shrink-0">
        <Image
          src={`${post.IMAGE_URL}?f_auto,q_auto` || "/placeholder-img.png"}
          alt={post.TITLE || "No Image"}
          fill
          sizes="200px"
          priority
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-800 mb-1 mt-3">
            {post.TITLE}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 break-all overflow-hidden">
            {contentPreview}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.TAGS?.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <footer className="text-xs text-gray-500 mb-2">
          <span className="mr-5">
            {post.INPUT_DATETIME.slice(0, 10)} | 조회수: {post.VIEWS}
          </span>
        </footer>
      </div>
    </div>
  );
}
