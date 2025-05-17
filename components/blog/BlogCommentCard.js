import ToastEditor from "@components/common/ToastEditor";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogCommentCard({
  comment,
  user,
  onEdit,
  onDelete,
  postNo,
  refreshComments,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [parentNo, setParentNo] = useState(null);
  const editorRef = useRef();
  const nestedEditorRef = useRef();

  const handleEdit = () => {
    const content = editorRef.current.getContent();
    onEdit({ ...comment, content: content });
    setIsEditing(false);
  };

  // 대댓글 저장
  const handleSaveNestedComment = async () => {
    const content = nestedEditorRef.current.getContent();
    const res = await fetch("/api/blog/comment/save", {
      method: "POST",
      headers: {
        "Conetent-type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        content: content,
        postNo: postNo,
        parentNo: parentNo,
      }),
    });
    const result = await res.json();
    if (result.success) {
      setParentNo(null);
      await refreshComments();
    }
  };

  const style =
    comment.depth === 0
      ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-2 border border-gray-200 dark:border-gray-700 mt-7"
      : "bg-gray-50 dark:bg-gray-900 ml-6 pl-4 py-4 border-l-4 border-green-300 dark:border-green-500 rounded-md mb-2";

  return (
    <div className={style}>
      {/* 수정모드시 */}
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
      {/* 읽기모드시 */}
      {!isEditing && (
        <div className="w-full">
          {/* 내용 */}
          <div className="prose dark:prose-invert max-w-none mb-2 text-sm text-gray-800 dark:text-gray-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => (
                  <p
                    className="whitespace-pre-wrap prose dark:prose-invert max-w-none mb-2 text-sm text-gray-800 dark:text-gray-200"
                    {...props}
                  />
                ),
              }}
            >
              {comment.content}
            </ReactMarkdown>
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

            <div className="flex">
              {parentNo === null && (
                <button onClick={() => setParentNo(comment.comment_no)}>
                  답글쓰기
                </button>
              )}
              {user.id === comment.user_id && (
                <>
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
                </>
              )}
            </div>
          </div>
          {parentNo !== null && (
            <div className="mt-5">
              <ToastEditor ref={nestedEditorRef} />
              <div className="flex gap-2 mt-1 justify-end">
                <button
                  onClick={() => setParentNo(null)}
                  className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 transition"
                >
                  취소
                </button>
                <button
                  onClick={() => handleSaveNestedComment()}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
