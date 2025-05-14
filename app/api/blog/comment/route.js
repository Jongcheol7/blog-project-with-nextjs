import { selectComments, updateComment } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 댓글 조회 로직
export async function GET() {
  try {
    const comments = await selectComments();
    return NextResponse.json(comments);
  } catch (err) {
    console.error("댓글 조회 실패 : ", err);
    return NextResponse.json({ error: "댓글 조회 실패" }, { status: 500 });
  }
}

// 댓글 수정 로직직
export async function PUT(request) {
  const { commentNo, userId, content } = await request.json();

  if (!commentNo) {
    return NextResponse.json({ error: "댓글 번호 없음" }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "댓글 내용 없음" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "로그인 정보보 없음" }, { status: 401 });
  }
  const comment = {
    comment_no: commentNo,
    user_id: userId,
    content: content,
  };

  try {
    await updateComment(comment);
  } catch (err) {
    console.error("댓글 수정 실패 : ", err);
    return NextResponse.json({ error: "댓글 수정 실패" }, { status: 500 });
  }
}
