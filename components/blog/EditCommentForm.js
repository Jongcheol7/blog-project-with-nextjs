"use client";
import { useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function EditCommentForm({ comment, onCancel, onSave }) {
  const editorRef = useRef();
  //const [content, setContent] = useState(comment.content);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current.getInstance().getMarkdown();
    await onSave(comment.comment_no, content);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-2">
      {/* <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
      /> */}
      <ToastEditor
        ref={editorRef}
        initialValue={comment.content}
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
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          수정완료
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          취소
        </button>
      </div>
    </form>
  );
}
