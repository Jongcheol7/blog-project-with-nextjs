"use client";

import { useState } from "react";

export default function BlogListCategory({
  categories,
  posts,
  handleFilterPosts,
}) {
  const [selectedId, setSelectedId] = useState("");

  const blogListFilter = (categoryId) => {
    setSelectedId(categoryId);
    const categoryIds = categories
      .filter((c) => c.parent_id === categoryId)
      .map((c) => c.category_id);

    const newFiltered =
      categoryId === ""
        ? posts
        : categoryIds.length === 0
        ? posts.filter((post) => post.category_id === categoryId) //소분류 클릭시
        : posts.filter((post) => categoryIds.includes(post.category_id)); //대분류 클릭시
    handleFilterPosts(newFiltered);
  };

  return (
    <ul className="bg-white shadow rounded-xl p-4 w-full">
      <li>
        <button
          onClick={() => blogListFilter("")}
          className={`w-full text-left px-4 py-2 rounded-lg transition 
        font-medium hover:bg-emerald-100
        ${
          selectedId === ""
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "text-gray-800"
        }`}
        >
          전체보기
        </button>
      </li>

      {categories.map((category) => {
        const isParent = category.depth === 0;
        const isSelected = selectedId === category.category_id;

        return (
          <li key={category.category_id} className="mt-1">
            <button
              onClick={() => blogListFilter(category.category_id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition
            ${
              isParent
                ? "font-semibold text-gray-900"
                : "ml-4 text-sm text-gray-600"
            }
            ${
              isSelected
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "hover:bg-gray-100"
            }`}
            >
              {category.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
