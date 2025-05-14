"use client";
import { useState } from "react";

export default function EditCommentForm({ comment, onCancel, onSave }) {
  console.log("edit comment form ");
  console.log(comment);
  console.log(onCancel);
  console.log(onSave);
  const [content, setContent] = useState(comment.content);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(comment.comment_no, content);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
      />
      <div className="flex justify-end gap2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          수정완료
        </button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}
