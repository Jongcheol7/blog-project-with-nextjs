"use client";

import { useEffect, useState } from "react";

export default function BlogHotLists() {
  const [posts, setPosts] = useState([]);
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

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {posts.slice(0, 5).map((post) => (
        <div
          key={post.post_no}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4"
        >
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-36 object-cover rounded-xl mb-4 transform scale-x-110"
            />
          )}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {post.title}
          </h3>
        </div>
      ))}
    </section>
  );
}
