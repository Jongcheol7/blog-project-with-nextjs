"use client";
export default function BlogListCategory({
  categories,
  posts,
  handleFilterPosts,
}) {
  const blogListFilter = (categoryId) => {
    console.log(categoryId);
    const newFiltered =
      categoryId === ""
        ? posts
        : posts.filter((post) => post.CATEGORY_ID === categoryId);
    console.log(newFiltered);
    handleFilterPosts(newFiltered);
  };

  return (
    <ul>
      <li>
        <button onClick={() => blogListFilter("")}>전체보기</button>
      </li>
      {categories.map((category) => (
        <li className="ml-0" key={category.CATEGORY_ID}>
          <button
            className={`text-sm hover:underline ${
              category.CATEGORY_TYPE === "소분류" ? "ml-4" : "font-semibold"
            }`}
            onClick={() => blogListFilter(category.CATEGORY_ID)}
          >
            {category.CATEGORY_NAME}
          </button>
        </li>
      ))}
    </ul>
  );
}
