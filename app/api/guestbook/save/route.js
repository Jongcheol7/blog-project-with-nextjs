import { insertGuestbook } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 방명록 저장
export async function POST(request) {
  const { userId, content, secretYn } = await request.json();
  console.log("userId : ", userId);
  console.log("content : ", content);
  console.log("secretYn : ", secretYn);
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "글 내용 없음" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json(
      { error: "로그인 정보가 없음음" },
      { status: 400 }
    );
  }

  const guestbook = {
    userId: userId,
    content: content,
    secretYn: secretYn || "N",
  };

  try {
    await insertGuestbook(guestbook);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("방명록 저장 실패 : ", err);
    return NextResponse.json({ error: "방명록 저장 실패" }, { status: 500 });
  }
}
