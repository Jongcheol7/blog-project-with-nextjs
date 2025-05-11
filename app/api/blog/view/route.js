import { blogViewUp } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 블로그 조회수 증가 함수
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  console.log("searchParams : ", searchParams);
  const postNo = searchParams.get("postNo");
  if (!postNo) {
    return NextResponse.json({ error: "글 번호가 없습니다" }, { status: 400 });
  }
  try {
    console.log("블로그 조회수 증가 시작 postNo : ", postNo);
    await blogViewUp(postNo);
    console.log("블로그 조회수 증가 종료");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("블로그 조회수 증가 오류 : ", err);
    return NextResponse.json(
      { error: "블로그 조회수 증가 오류" },
      { status: 500 }
    );
  }
}
