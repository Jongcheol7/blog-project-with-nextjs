import { NextResponse } from "next/server";
import { selectBlogs } from "../../../lib/blog-db";

export async function GET() {
  try {
    const posts = await selectBlogs();
    return NextResponse.json(posts);
  } catch (err) {
    console.log("블로그 목록 조회 오류 : ", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
