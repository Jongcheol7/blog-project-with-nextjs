import Image from "next/image";

export default function BlogLists({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.POST_NO} className="mb-3">
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}

function Post({ post }) {
  return (
    <div className="flex gap-4">
      <div className="w-[200px] h-[140px] relative flex-shrink-0">
        <Image
          src={post.IMAGE_URL}
          alt={post.TITLE}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-800 mb-1 mt-3">
            {post.TITLE}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2">{post.CONTENT}</p>
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
