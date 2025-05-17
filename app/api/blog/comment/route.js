import { deleteComment, selectComments, updateComment } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 댓글 조회 로직
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postNo = searchParams.get("postNo");
    const comments = await selectComments(postNo);
    return NextResponse.json(comments);
  } catch (err) {
    console.error("댓글 조회 실패 : ", err);
    return NextResponse.json({ error: "댓글 조회 실패" }, { status: 500 });
  }
}

// 댓글 수정 로직
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("댓글 수정 실패 : ", err);
    return NextResponse.json({ error: "댓글 수정 실패" }, { status: 500 });
  }
}

// 댓글 삭제 로직
export async function POST(request) {
  const { commentNo } = await request.json();
  if (!commentNo) {
    return NextResponse.json({ error: "댓글 번호 없음" }, { status: 400 });
  }
  try {
    await deleteComment(commentNo);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("댓글 삭제 실패 : ", err);
    return NextResponse.json({ error: "댓글 삭제 실패" }, { status: 500 });
  }
}
