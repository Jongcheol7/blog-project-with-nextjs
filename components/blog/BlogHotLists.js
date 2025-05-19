"use client";

import { useUserStore } from "@store/UserStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogHotLists() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const { user } = useUserStore();
  const [maxVisible, setMaxVisible] = useState(5);
  const isUser = user === null ? false : true;

  useEffect(() => {
    const selectHotBlogLists = async () => {
      const res = await fetch("/api/blog/hot");
      const posts = await res.json();
      if (posts) {
        setPosts(posts);
      }
    };
    selectHotBlogLists();
  }, []);

  // 창크기에 따른 인기글 보여주는 갯수 조절하기.
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setMaxVisible(2); //모바일
      } else if (window.innerWidth < 1024) {
        setMaxVisible(3); //태블릿
      } else {
        setMaxVisible(5); //PC
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.addEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {posts.slice(0, maxVisible).map((post) => (
        <div
          key={post.post_no}
          className="bg-amber-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4"
          onClick={() => {
            {
              post.private_yn === "Y" && isUser
                ? router.push(`/blog/${post.post_no}`)
                : post.private_yn === "Y"
                ? alert("비밀글 입니다. 로그인한 사람만 볼수 있습니다.")
                : router.push(`/blog/${post.post_no}`);
            }
          }}
        >
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-36 object-cover rounded-xl mb-4 transform scale-x-110"
            />
          )}
          <div className="flex items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {post.title}
            </h3>
            {post.private_yn === "Y" && <span className=" mb-2">🔒</span>}
          </div>
        </div>
      ))}
    </section>
  );
}
