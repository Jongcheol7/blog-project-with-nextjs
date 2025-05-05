"use client";

import { useState } from "react";

export default function ManagerPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/exec-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setError("쿼리 수행 에러");
    }
  };
  return (
    <>
      <form className="space-y-2">
        <h1 className="text-xl font-bold mb-2">관리자용 쿼리</h1>
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border w-full p-2"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-700 text-white px-4 py-1 mt-2 rounded hover:bg-green-600"
        >
          실행
        </button>
      </form>
      {result && (
        <div className="mt-4 text-sm bg-gray-100 p-4 rounded">
          <h2 className="font-semibold text-gray-800 mb-2">실행 결과</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
    </>
  );
}
