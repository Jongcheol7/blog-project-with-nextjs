"use client";
import ToastEditor from "@components/common/ToastEditor";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function GuestbookCard({ user, guestbook, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef();
  const [secretYn, setSecretYn] = useState(guestbook.secret_yn);

  console.log("guestbook : ", guestbook);

  // 외부 클릭시 ... 토글 닫자!
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    const content = editorRef.current.getContent();
    console.log("content : ", content);
    onEdit({ ...guestbook, content: content, secret_yn: secretYn });
    setIsEditing(false);
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 
                   mb-6 border border-gray-200 dark:border-gray-700 flex"
      >
        {isEditing && (
          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl">
              <ToastEditor ref={editorRef} />
              <div className="flex justify-end gap-2 items-center mr-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={secretYn === "Y"}
                  onChange={(e) => setSecretYn(e.target.checked ? "Y" : "N")}
                />
                <span className="ml-1">비밀글</span>
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
          <>
            <div className="flex-1">
              {/* 내용 */}
              {guestbook.secret_yn === "Y" && guestbook.user_id !== user.id ? (
                <span>비밀글 입니다.</span>
              ) : (
                <div className="prose dark:prose-invert max-w-none mb-2 text-sm text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{guestbook.content}</ReactMarkdown>
                </div>
              )}

              {/* 작성일자 및 아이디 */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {guestbook.input_datetime.slice(0, 10)} by{"  "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {guestbook.user_id}
                  </span>
                </span>
              </div>
            </div>

            {/* ... 버튼 */}
            {/* 수정,삭제 버튼 */}
            {user.id === guestbook.user_id && (
              <div className="relative" ref={menuRef}>
                {/* ... 버튼 영역역 */}
                <button
                  onClick={() => setShowActions((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 114.001-.001A2 2 0 016 10zm4 0a2 2 0 114.001-.001A2 2 0 0110 10zm4 0a2 2 0 114.001-.001A2 2 0 0114 10z" />
                  </svg>
                </button>

                {showActions && (
                  <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 border border-gray-200 rounded-xl shadow-lg z-20 text-sm">
                    <button
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="block w-full text-left px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(guestbook.guestbook_no)}
                      className="block w-full text-left px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// {showActions && (
//               <div className="flex gap-2">
//                 <button
//                   onClick={onEdit}
//                   className="px-3 py-1 text-xs bg-blue-500 text-white rounded-3xl
//                        hover:bg-blue-600 transition"
//                 >
//                   수정
//                 </button>
//                 <button
//                   onClick={() => onDelete(guestbook.guestbook_no)}
//                   className="px-3 py-1 text-xs bg-red-500 text-white rounded-3xl
//                        hover:bg-red-600 transition"
//                 >
//                   삭제
//                 </button>
//               </div>
//             )}
