"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ postNo }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/blog?postNo=${postNo}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("삭제가 완료되었습니다.");
        router.push("/blog");
      } else {
        const data = await res.json();
        alert("삭제 실패: " + (data ? data.error : "알 수 없는 오류"));
      }
    } catch (err) {
      alert("요청 중 오류 발생 : ", err.message);
    }
  };

  return (
    <button
      className="bg-yellow-100 border border-red-400 text-red-600 text-sm px-2 py-1 rounded hover:bg-yellow-200 transition"
      onClick={handleDelete}
    >
      삭제
    </button>
  );
}
