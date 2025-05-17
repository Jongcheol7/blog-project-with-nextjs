"use client";

import ToastEditor from "@components/common/ToastEditor";
import { useUserStore } from "@store/UserStore";
import { useEffect, useRef, useState } from "react";
import GuestbookCard from "./GuestbookCard";

export default function GuestbookList() {
  const [lists, setLists] = useState([]);
  const editorRef = useRef();
  const [secretYn, setSecretYn] = useState("N");
  const { user } = useUserStore();

  // 방명록 조회
  const getAllLists = async () => {
    const res = await fetch("/api/guestbook");
    const data = await res.json();
    setLists(data);
  };

  useEffect(() => {
    getAllLists();
  }, []);

  // 방명록 저장
  const handleSaveClick = async () => {
    const content = editorRef.current.getContent();
    const res = await fetch("/api/guestbook/save", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        userId: user.id,
        secretYn: secretYn,
      }),
    });
    const result = await res.json();
    if (result.success) {
      editorRef.current.clearContent();
      getAllLists();
    }
  };

  // 방명록 수정
  const handleEdit = async (guestbook) => {
    console.log("guestbook", guestbook);
    const res = await fetch("/api/guestbook", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: guestbook.content,
        secretYn: guestbook.secret_yn,
        guestbookNo: guestbook.guestbook_no,
      }),
    });
    const result = await res.json();
    if (result.success) {
      editorRef.current.clearContent();
      getAllLists();
    }
  };

  // 방명록 삭제
  const handleDelete = async (guestbookNo) => {
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ guestbookNo: guestbookNo }),
    });
    const result = await res.json();
    if (result.success) {
      alert("방명록 삭제 완료하였습니다.");
      getAllLists();
    }
  };

  return (
    <>
      <div className="w-full mb-5">
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl">
          <ToastEditor ref={editorRef} />
          <div className="flex justify-end gap-2 items-center mr-3 py-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={secretYn === "Y"}
              onChange={(e) => setSecretYn(e.target.checked ? "Y" : "N")}
            />
            <span>비밀글</span>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
            >
              등록
            </button>
          </div>
        </div>
      </div>
      <ul>
        {lists.map((list) => (
          <li key={list.guestbook_no}>
            <GuestbookCard
              user={user}
              guestbook={list}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
