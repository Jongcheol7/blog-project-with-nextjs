import ToastEditor from "@components/common/ToastEditor";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function BlogCommentCard({ comment, user, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef();

  const handleEdit = () => {
    const content = editorRef.current.getContent();
    onEdit({ ...comment, content: content });
    setIsEditing(false);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 
                   mb-6 border border-gray-200 dark:border-gray-700 flex"
    >
      {isEditing && (
        <div className="w-full">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl">
            <ToastEditor ref={editorRef} />
            <div className="flex justify-end gap-2 items-center mr-3 py-2 text-sm text-gray-700 dark:text-gray-200">
              <button
                onClick={() => handleEdit()}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
              >
                수정
              </button>
              <button
                onClick={() => {
                  setIsEditing((prev) => !prev);
                }}
                className="px-4 py-2 bg-red-300 text-gray-800 text-sm font-medium rounded-md hover:bg-red-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {!isEditing && (
        <div className="w-full">
          {/* 내용 */}
          <div className="prose dark:prose-invert max-w-none mb-2 text-sm text-gray-800 dark:text-gray-200">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {/* 작성일자 및 아이디 */}
            <span>
              {comment.input_datetime.slice(0, 10)} by{"  "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {comment.user_id}
              </span>
            </span>

            {/* 답글, 수정, 삭제 버튼 */}
            {user.id === comment.user_id && (
              <div className="flex">
                <button>답글쓰기</button>
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(comment.comment_no)}
                  className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
