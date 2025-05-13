"use client";
import { createComment } from "@app/actions/blog";
import { useActionState, useEffect, useState } from "react";

export default function BlogComments({ postNo, user }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getAllComments = async () => {
      const res = await fetch(`/api/blog/comment?postNo=${postNo}`);
      const data = await res.json();
      setComments(data);
    };
    getAllComments();
  }, [postNo]);

  const [state, formAction] = useActionState(createComment, {});

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">댓글</h2>

      {/* 댓글 목록 */}
      <ul className="space-y-6">
        {comments.map((comment) => (
          <li key={comment.comment_no} className="border-b pb-4">
            {/* 작성자 */}
            <p className="font-semibold text-gray-800">{comment.user_id}</p>

            {/* 본문 */}
            <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>

            {/* 날짜 + 답글쓰기 */}
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>
                {new Date(comment.input_datetime).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button className="hover:underline">답글쓰기</button>
            </div>
          </li>
        ))}
      </ul>

      {/* 댓글 작성폼 (목록 아래) */}
      {user && (
        <form action={formAction} className="mt-8 space-y-2">
          <textarea
            name="content"
            placeholder="댓글을 입력하세요"
            className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
          <input type="hidden" name="post_no" value={postNo} />
          <input type="hidden" name="user_id" value={user?.id} />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              등록
            </button>
          </div>
          {!state.success && state.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
