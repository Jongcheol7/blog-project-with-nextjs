"use client";
export default function BlogListCategory({
  categories,
  posts,
  handleFilterPosts,
}) {
  const blogListFilter = (categoryId) => {
    console.log(categoryId);
    const newFiltered = posts.filter((post) => post.CATEGORY_ID === categoryId);
    console.log(newFiltered);
    handleFilterPosts(newFiltered);
  };

  return (
    <ul>
      {categories.map((category) => (
        <li className="ml-0" key={category.CATEGORY_ID}>
          <button
            className={category.CATEGORY_TYPE === "소분류" ? "ml-4" : ""}
            onClick={() => blogListFilter(category.CATEGORY_ID)}
          >
            {category.CATEGORY_NAME}
          </button>
        </li>
      ))}
    </ul>
  );
}
