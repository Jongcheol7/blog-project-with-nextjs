"use client";
import ImagePicker from "@common/Image";
import { useActionState, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";
import { useFormStatus } from "react-dom";
import BlogWriteCategory from "@components/blog/BlogWriteCategory";
import imageCompression from "browser-image-compression";
import { updatePost } from "@app/actions/blog";
import { extractPublicIdsFromMarkdown } from "@util/extractPublicIds";
import { useUserStore } from "@store/UserStore";

// 마크다운 에디터
const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="float-right w-20 h-10 bg-green-500 p-1 text-white font-semibold py-2 rounded hover:bg-green-700"
    >
      {pending ? "수정중..." : "수정완료"}
    </button>
  );
}
export default function BlogUpdateForm({ post }) {
  console.log(post);
  //서버 액션 연동
  //createPost는 서버함수이지만 사용가능한건 서버action 이라 가능하다..
  const [state, formAction] = useActionState(updatePost, {});
  const editorRef = useRef();
  const [markdown, setMarkdown] = useState(post.content);
  const [tags, setTags] = useState(post.tags.split(","));
  const [uploadedIds, setUploadedIds] = useState(() => {
    return extractPublicIdsFromMarkdown(post.content);
  });
  const [isPrivate, setIsPrivate] = useState(
    post.private_yn === "Y" ? "Y" : "N"
  );

  const { user } = useUserStore();
  console.log("수정폼에서의 user", user);
  const userId = user.id;

  console.log("글수정 화면 진입 -----");
  console.log(post);
  console.log("초기 데이터 출력완료-------");

  // 태그 추가 이벤트
  const handleTagsKeyDown = (e) => {
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

  // 태그 삭제 이벤트
  const handleTagDelete = (deleteTag) => {
    setTags((prev) => prev.filter((tag) => tag !== deleteTag));
  };

  return (
    <div className="max-w-200 mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">글수정</h1>
      <form action={formAction} className="space-y-6">
        {/* 글번호 */}
        <input type="hidden" value={post.post_no} name="postNo" />
        <input type="hidden" value={userId} name="userId" />
        <div className="flex items-center gap-3">
          {/* 카테고리 */}
          <div className="block text-gray-700 mb-3">
            {/* 클라이언트에서 직접 서버전용 함수를 쓸수 없기에.. 컴포넌트 새로팠음 */}
            {/* 사실 아래 컴포넌트도 훅을 사용하니 결국 클라이언트 컴포넌트지만 역할분리겸... */}
            <BlogWriteCategory categoryId={post.category_id} />
          </div>
          {/* 비밀글여부 */}
          <label>
            <input
              type="checkbox"
              name="privateYn"
              checked={isPrivate === "Y"}
              onChange={(e) => setIsPrivate(e.target.checked ? "Y" : "N")}
            />
            비밀글
          </label>
        </div>

        {/* 제목 */}
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
            defaultValue={post.title}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 썸네일 */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            썸네일
          </label>
          <ImagePicker imageUrl={post.image_url} />
        </div>

        {/* 태그 */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            태그
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
                <button
                  onClick={() => handleTagDelete(tag)}
                  className="ml-2 text-green-600 hover:text-red-500 font-bold"
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={handleTagsKeyDown}
          />
          <input
            type="hidden"
            name="tags"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={tags.join(",")}
          />
        </div>

        {/* 내용 */}
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
            initialValue={post.content}
            previewStyle="vertical" // 'tab'도 가능
            height="400px"
            initialEditType="wysiwyg" // 또는 'markdown'
            useCommandShortcut={true}
            onChange={() => {
              const content = editorRef.current.getInstance().getMarkdown();
              setMarkdown(content);
            }}
            className="border border-gray-300 rounded"
            hooks={{
              addImageBlobHook: async (blob, callback) => {
                // 1. 압축 옵션 설정
                const options = {
                  maxSizeMB: 1, // 1MB 이하로 압축
                  maxWidthOrHeight: 1024, // 크기 제한
                  useWebWorker: true, // 성능 개선
                };
                //이미지 압축
                const compressedBlob = await imageCompression(blob, options);
                const formData = new FormData();
                formData.append("file", compressedBlob);
                formData.append("upload_preset", "blog_upload");
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const data = await res.json();
                setUploadedIds((prev) => [...prev, data.public_id]);
                callback(data.secure_url, "업로드된 이미지");
              },
            }}
          />
          <input
            type="hidden"
            name="uploadedIds"
            value={uploadedIds.join(",")}
          />
        </div>

        {/* 에러 + 버튼 */}
        <div className="flex gap-2">
          {/* 에러 내용 */}
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
          {/* 작성완료 버튼 */}
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
