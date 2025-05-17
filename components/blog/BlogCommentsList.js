"use client";
import { useEffect, useRef, useState } from "react";
import BlogCommentCard from "./BlogCommentCard";
import ToastEditor from "@components/common/ToastEditor";

export default function BlogCommentsList({ postNo, user }) {
  const [comments, setComments] = useState([]);
  const editorRef = useRef();

  // 댓글 조회
  const getAllComments = async () => {
    const res = await fetch(`/api/blog/comment?postNo=${postNo}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  // 댓글 저장
  const handleSaveClick = async () => {
    const content = editorRef.current.getContent();
    const res = await fetch("/api/blog/comment/save", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        userId: user.id,
        postNo: postNo,
      }),
    });
    const result = await res.json();
    if (result.success) {
      editorRef.current.clearContent();
      getAllComments();
    }
  };

  // 댓글 수정
  const handleEdit = async (comment) => {
    const res = await fetch("/api/blog/comment", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        commentNo: comment.comment_no,
        userId: comment.user_id,
        content: comment.content,
      }),
    });
    const result = await res.json();
    if (result.success) {
      getAllComments();
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentNo) => {
    const res = await fetch("/api/blog/comment", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ commentNo: commentNo }),
    });
    const result = await res.json();
    if (result.success) {
      alert("댓글 삭제 완료하였습니다.");
      getAllComments();
    }
  };

  return (
    <div className="w-full mx-auto py-10 mt-10">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">댓글</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_no}>
            <BlogCommentCard
              user={user}
              comment={comment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>

      <ToastEditor ref={editorRef} />

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
        >
          취소
        </button>
        <button
          onClick={() => handleSaveClick()}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          등록
        </button>
      </div>
    </div>
  );
}
