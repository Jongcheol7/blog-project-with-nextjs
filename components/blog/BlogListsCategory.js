"use client";
export default function BlogListCategory({
  categories,
  posts,
  handleFilterPosts,
}) {
  const blogListFilter = (categoryId) => {
    console.log("선택된 카테고리 아이디 : ", categoryId);
    const newFiltered =
      categoryId === ""
        ? posts
        : posts.filter((post) => post.category_id === categoryId);
    handleFilterPosts(newFiltered);
  };
  console.log("카테고리로 넘어온 포스트 정보 : ", posts);
  return (
    <ul>
      <li>
        <button onClick={() => blogListFilter("")}>전체보기</button>
      </li>
      {categories.map((category) => (
        <li className="ml-0" key={category.category_id}>
          <button
            className={`text-sm hover:underline ${
              category.category_type === "소분류" ? "ml-4" : "font-semibold"
            }`}
            onClick={() => blogListFilter(category.category_id)}
          >
            {category.category_name}
          </button>
        </li>
      ))}
    </ul>
  );
}
