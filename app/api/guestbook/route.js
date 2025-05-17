import {
  deleteGuestbook,
  selectGuestbook,
  updateGuestbook,
} from "@lib/blog-db";
import { NextResponse } from "next/server";

// 방명록 조회
export async function GET() {
  try {
    const lists = await selectGuestbook();
    return NextResponse.json(lists);
  } catch (err) {
    console.log("방명록 조회 실패 : ", err);
    return NextResponse.json({ error: "방명록 조회 실패" }, { status: 500 });
  }
}

// 방명록 수정
export async function PUT(request) {
  const { content, secretYn, guestbookNo } = await request.json();
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "글 내용 없음" }, { status: 400 });
  }
  if (!guestbookNo) {
    return NextResponse.json({ error: "방명록 번호호 없음" }, { status: 400 });
  }
  const guestbook = {
    content: content,
    secretYn: secretYn || "N",
    guestbookNo: guestbookNo,
  };
  try {
    await updateGuestbook(guestbook);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("방명록 수정 실패 : ", err);
    return NextResponse.json({ error: "방명록 수정 실패" }, { status: 500 });
  }
}

// 방명록 삭제
export async function POST(request) {
  const { guestbookNo } = await request.json();
  if (!guestbookNo) {
    return NextResponse.json({ error: "방명록 번호 없음" }, { status: 400 });
  }

  try {
    await deleteGuestbook(guestbookNo);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("방명록 삭제 실패 : ", err);
    return NextResponse.json({ error: "방명록 삭제 실패" }, { status: 500 });
  }
}
