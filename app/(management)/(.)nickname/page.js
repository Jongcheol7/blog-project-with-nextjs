"use client";
import { useUserStore } from "@store/UserStore";
import { Text } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function NicknameChange() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const nicknameRef = useRef();
  const { user } = useUserStore();

  const handleNicknameChange = async (nickname) => {
    //e.preventDefault();
    setMessage(null);
    console.log("nickname 11 :", nickname);
    try {
      const res = await fetch("/api/management/nickname", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `저장됨` });
        alert("닉네임 저장 성공");
        router.back();
      } else {
        setMessage({ type: "error", text: `저장실패 : ${data.error}` });
      }
    } catch (err) {
      setMessage({ type: "error", text: "네트워크 오류가 발생했어요." });
    }
  };

  return (
    //fixed inset-0 으로 화면전체를 모달로 인식하도록함.
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      onClick={() => router.back()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-7 z-50 rounded shadow-2xl"
      >
        <h1 className="font-bold mb-3">닉네임 변경</h1>
        <div className="flex items-center">
          <label htmlFor="nickname" className="text-sm font-medium w-40">
            새로운 닉네임
          </label>
          <input
            ref={nicknameRef}
            type="text"
            id="nickname"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-green-400 py-1 px-2 rounded  mt-2 hover:bg-green-500"
            onClick={() => handleNicknameChange(nicknameRef.current.value)}
          >
            변경
          </button>
          <button
            className="bg-gray-300 py-1 px-2 rounded mt-2 hover:bg-gray-400"
            onClick={() => router.back()}
          >
            취소
          </button>
        </div>
        {message && (
          <p
            className={`${
              message.type === "error" ? "text-red-500" : "text-green-500"
            } mt-2`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
