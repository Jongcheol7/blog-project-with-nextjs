import { insertComment } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 댓글 저장
export async function POST(request) {
  const { userId, content, postNo, parentNo } = await request.json();
  console.log("userId : ", userId);
  console.log("content : ", content);
  console.log("postNo : ", postNo);
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "글 내용 없음" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "로그인 정보가 없음" }, { status: 400 });
  }
  if (!postNo) {
    return NextResponse.json({ error: "게시글 번호 없음" }, { status: 400 });
  }

  const comment = {
    postNo: postNo,
    userId: userId,
    content: content,
    parentNo: parentNo || null,
  };

  try {
    await insertComment(comment);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("댓글 저장 실패 : ", err);
    return NextResponse.json({ error: "댓글 저장 실패" }, { status: 500 });
  }
}
``;
