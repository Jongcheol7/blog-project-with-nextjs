"use client";
import createPost from "../../actions/blog";
import ImagePicker from "../common/image";
import { useActionState, useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function BlogWriteForm() {
  const [state, formAction] = useActionState(createPost, {});
  const editorRef = useRef();
  const [markdown, setMarkdown] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagsKeyDown = (e) => {
    console.log(e);
    const keys = ["Enter", "Tab"];
    if (keys.includes(e.key)) {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value)) {
        setTags((prev) => [...prev, value]);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="max-w-200 mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            제목
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            썸네일
          </label>
          <ImagePicker />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            태그
          </label>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span>
                {tag}
                <button>x</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            name="tags"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={handleTagsKeyDown}
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            내용
          </label>
          <input type="hidden" name="content" value={markdown} />
          <ToastEditor
            ref={editorRef}
            initialValue={" "}
            previewStyle="vertical" // 'tab'도 가능
            height="400px"
            initialEditType="wysiwyg" // 또는 'markdown'
            useCommandShortcut={true}
            onChange={() => {
              const content = editorRef.current.getInstance().getMarkdown();
              setMarkdown(content);
            }}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            {state.errors && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                <strong className="block font-medium mb-1">
                  입력 오류가 있어요:
                </strong>
                <ul className="list-disc list-inside">
                  {state.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="float-right w-20 h-10 bg-green-500 p-1 text-white font-semibold py-2 rounded hover:bg-green-700"
          >
            작성완료
          </button>
        </div>
      </form>
    </div>
  );
}
