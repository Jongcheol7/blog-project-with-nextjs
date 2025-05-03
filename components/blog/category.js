import { useEffect, useState } from "react";

export default function CategorySelect() {
  const [categories, setCategories] = useState([]);

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

    fetchCategories();
  }, []);

  return (
    <select
      name="category"
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">카테고리를 선택하세요</option>
      {categories.map((category) => (
        <option key={category.CATEGORY_ID} value={category.CATEGORY_ID}>
          {category.NAME}
        </option>
      ))}
    </select>
  );
}
