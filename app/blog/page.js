"use client";
import Link from "next/link";
import BlogLists from "../../components/blog/BlogLists";
import BlogListCategory from "../../components/blog/BlogListsCategory";
import { useEffect, useState } from "react";

export default function BlogHomePage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("블로그목록 로딩 실패:", err);
      }
    };

    fetchCategories();
    fetchPosts();
  }, []);

  const handleFilterPosts = (filterPosts) => {
    setFilteredPosts(filterPosts);
  };

  return (
    <div className="flex">
      {/* 좌측 카테고리 사이드바 */}
      <aside className="w-52 p-4 bg-gray-50 rounded shadow-sm">
        <h3 className="text-sm font-semibold mb-3">카테고리</h3>
        <BlogListCategory
          categories={categories}
          posts={posts}
          handleFilterPosts={handleFilterPosts}
        />
      </aside>

      {/* 블로그 목록 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📚 블로그 목록</h1>
          <Link
            href="/blog-write"
            className="border border-red-400 rounded px-3 py-1 bg-yellow-200 text-red-600 text-sm font-medium hover:bg-yellow-300"
          >
            ✍ 새글 작성
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>제목</option>
            <option>내용</option>
          </select>
          <input
            type="text"
            name="search"
            placeholder="검색어를 입력하세요"
            className="border border-gray-300 rounded px-3 py-1 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-700 text-white text-sm px-4 py-1 rounded hover:bg-green-600">
            검색
          </button>
        </div>
        <BlogLists posts={filteredPosts} />
      </div>
    </div>
  );
}
