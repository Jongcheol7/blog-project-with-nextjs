"use client";
import { createComment } from "@app/actions/blog";
import { useActionState, useEffect, useRef, useState } from "react";
import EditCommentForm from "./EditCommentForm";
import BlogCommentDetail from "./BlogCommentDetail";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function BlogComments({ postNo, user }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const editorRef = useRef();
  const hiddenCommentContent = useRef();

  const [state, formAction] = useActionState(createComment, {});

  useEffect(() => {
    const getAllComments = async () => {
      const res = await fetch(`/api/blog/comment?postNo=${postNo}`);
      const data = await res.json();
      setComments(data);
    };
    getAllComments();
  }, [postNo]);

  useEffect(() => {
    if (state.success) {
      const getAllComments = async () => {
        const res = await fetch(`/api/blog/comment?postNo=${postNo}`);
        const data = await res.json();
        setComments(data);
      };
      getAllComments();
      setIsEditorOpen(false); // 작성 후 에디터 닫기
    }
  }, [state]);

  const handleClickEdit = (commentNo) => {
    setEditingId(commentNo);
  };

  const handleClickDelete = async (commentNo) => {
    const res = await fetch("/api/blog/comment", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ commentNo: commentNo }),
    });
    const data = await res.json();
    if (data.success) {
      const getAllComments = async () => {
        const res = await fetch(`/api/blog/comment?postNo=${postNo}`);
        const data = await res.json();
        setComments(data);
      };
      getAllComments();
      setIsEditorOpen(false); // 작성 후 에디터 닫기
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">댓글</h2>

      <ul className="space-y-6">
        {comments.map((comment) => (
          <li key={comment.comment_no} className="border-b pb-4">
            {editingId === comment.comment_no ? (
              <EditCommentForm
                comment={comment}
                onCancel={() => setEditingId(null)}
                onSave={async (comment_no, content) => {
                  try {
                    await fetch("/api/blog/comment", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        commentNo: comment_no,
                        userId: user?.id,
                        content,
                      }),
                    });
                    setEditingId(null);
                    const res = await fetch(
                      `/api/blog/comment?postNo=${postNo}`
                    );
                    const data = await res.json();
                    setComments(data);
                  } catch (err) {
                    console.log("댓글 수정 실패: ", err);
                  }
                }}
              />
            ) : (
              <BlogCommentDetail
                comment={comment}
                userId={user?.id}
                onClickEdit={handleClickEdit}
                onClickDelete={handleClickDelete}
              />
            )}
          </li>
        ))}
      </ul>

      {user && (
        <>
          {!isEditorOpen ? (
            <div className="text-right mt-6">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                댓글 작성하기
              </button>
            </div>
          ) : (
            <form
              action={formAction}
              onSubmit={() => {
                hiddenCommentContent.current.value = editorRef.current
                  ?.getInstance()
                  ?.getMarkdown();
              }}
              className="mt-8 space-y-2"
            >
              <ToastEditor
                ref={editorRef}
                initialValue=""
                placeholder="댓글을 입력하세요"
                previewStyle="vertical"
                height="150px"
                initialEditType="wysiwyg"
                hideModeSwitch={true}
                toolbarItems={[
                  ["bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task"],
                  ["table"],
                  ["link"],
                  ["code", "codeblock"],
                ]}
                hooks={{
                  addImageBlobHook: () => {
                    alert("댓글에는 이미지를 첨부할 수 없습니다.");
                    return false;
                  },
                }}
              />
              <input type="hidden" name="content" ref={hiddenCommentContent} />
              <input type="hidden" name="post_no" value={postNo} />
              <input type="hidden" name="user_id" value={user?.id} />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  취소
                </button>
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
        </>
      )}
    </div>
  );
}
