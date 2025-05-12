import { updateBlogLike } from "@lib/blog-db";
import { NextResponse } from "next/server";

// 블로그 좋아요 업데이트 함수
export async function PUT(request) {
  //   const { searchParams } = new URL(request.url);
  //   const postNo = searchParams.get("postNo");
  //   const userId = searchParams.get("userId");
  const { postNo, userId } = await request.json();
  if (!postNo) {
    return NextResponse.json({ error: "글 번호가 없습니다" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json(
      { error: "로그인 정보가 없습니다" },
      { status: 400 }
    );
  }
  try {
    const result = await updateBlogLike(postNo, userId);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.log("좋아요 업데이트 실패 : ", err);
    return NextResponse.json(
      { error: "좋아요 업데이트 실패" },
      { status: 500 }
    );
  }
}
