"use client";
import Link from "next/link";
import BlogLists from "@components/blog/BlogLists";
import BlogListCategory from "@components/blog/BlogListsCategory";
import { useEffect, useRef, useState } from "react";
import { useMobileStore, useUserStore } from "@store/UserStore";

export default function BlogHomePage() {
  console.log("블로그홈화면 페이지");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const searchTypeRef = useRef();
  const searchInputRef = useRef();
  const { user } = useUserStore();
  // 세션값 가져와서 관리자 여부인지, 세션이 있는지 판단
  const isAdmin = user?.isAdmin ? true : false;
  const isUser = user === null ? false : true;
  const isMobile = useMobileStore((state) => state.isMobile);

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
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        });
        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("블로그목록 로딩 실패:", err);
      }
    };

    fetchCategories();
    fetchPosts();
  }, [user]);

  // 카테고리 클릭에 의한 필터
  const handleFilterPosts = (filterPosts) => {
    console.log("카테고리 클릭에 의한 필터 : ", filterPosts);
    setFilteredPosts(filterPosts);
    searchInputRef.current.value = "";
  };

  // 검색에 의한 필터
  const handleSearchFilter = () => {
    if (searchTypeRef.current.value === "title") {
      setFilteredPosts(
        posts.filter((post) =>
          post.TITLE.includes(searchInputRef.current.value)
        )
      );
    }
    if (searchTypeRef.current.value === "content") {
      setFilteredPosts(
        posts.filter((post) =>
          post.CONTENT.includes(searchInputRef.current.value)
        )
      );
    }
  };

  return (
    // <div className="flex w-full">
    <div className={`flex w-full ${isMobile ? "flex-col" : ""}`}>
      {/* 좌측 카테고리 사이드바 */}
      <aside
        className={`${
          isMobile ? "" : "w-50"
        } flex-shrink-0 pl-3 mt-2 bg-gray-50 rounded`}
      >
        <h3 className="text-xl font-semibold mb-3">🗂️Categories</h3>
        <BlogListCategory
          categories={categories}
          posts={posts}
          handleFilterPosts={handleFilterPosts}
          isMobile={isMobile}
        />
      </aside>

      {/* 블로그 목록 */}
      <main className="flex-1 min-w-0 px-4 py-3">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-800">블로그 목록</h1> */}
        </div>
        <div
          className={`flex items-center gap-2 mb-2 justify-between border-b border-gray-300 pb-2 ${
            isMobile ? "flex-col" : ""
          }`}
        >
          <div className="flex gap-1">
            <select
              ref={searchTypeRef}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={"title"}>제목</option>
              <option value={"content"}>내용</option>
            </select>
            <input
              type="text"
              name="search"
              ref={searchInputRef}
              placeholder="검색어를 입력하세요"
              className="border border-gray-300 rounded px-3 py-1 text-sm w-60 min-w-40 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSearchFilter}
              className="bg-green-700 text-white text-sm px-4 py-1 min-w-15 rounded hover:bg-green-600"
            >
              검색
            </button>
          </div>
          {isAdmin && (
            <Link
              href="/blog-write"
              className="bg-amber-50 border border-gray-300 min-w-25 text-red-600 text-sm px-1 py-1 rounded hover:bg-yellow-200 transition"
            >
              ✍ 새글 작성
            </Link>
          )}
        </div>
        <BlogLists posts={filteredPosts} isMobile={isMobile} />
      </main>
    </div>
  );
}
