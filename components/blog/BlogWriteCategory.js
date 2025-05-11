import { useEffect, useState } from "react";

export default function BlogWriteCategory({ categoryId }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(
          data.filter((category) => category.category_type === "소분류")
        );
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
      }
    };

    fetchCategories();
  }, []);
  return (
    <select
      name="category"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">카테고리를 선택하세요</option>
      {categories.map((category) => (
        <option key={category.category_id} value={category.category_id}>
          {category.category_name}
        </option>
      ))}
    </select>
  );
}
