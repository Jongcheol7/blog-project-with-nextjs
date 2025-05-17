// components/blog/CommentForm.jsx
"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CommentForm({ formAction, postNo, userId, state }) {
  const editorRef = useRef();
  const hiddenRef = useRef();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (state.success) {
      setContent("");
      editorRef.current?.getInstance()?.setMarkdown("");
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        hiddenRef.current.value = editorRef.current
          ?.getInstance()
          ?.getMarkdown();
      }}
      className="mt-8 space-y-2"
    >
      <Suspense fallback={null}>
        <ToastEditor
          ref={editorRef}
          initialValue=""
          previewStyle="vertical"
          height="150px"
          initialEditType="wysiwyg"
          hideModeSwitch={true}
          placeholder="댓글을 입력하세요"
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
      </Suspense>
      <input type="hidden" name="content" ref={hiddenRef} />
      <input type="hidden" name="post_no" value={postNo} />
      <input type="hidden" name="user_id" value={userId} />

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
  );
}
