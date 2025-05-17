"use client";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import { forwardRef, Suspense, useImperativeHandle, useRef } from "react";

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

const ToastEditor = forwardRef((props, ref) => {
  const toastRef = useRef();

  useImperativeHandle(ref, () => ({
    getContent: () => toastRef.current.getInstance().getMarkdown(),
    clearContent: () => toastRef.current.getInstance().setMarkdown(""),
  }));

  return (
    <>
      <Editor
        ref={toastRef}
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
    </>
  );
});

export default ToastEditor;
