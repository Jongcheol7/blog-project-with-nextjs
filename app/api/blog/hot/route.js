import { selectHotBlogs } from "@lib/blog-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await selectHotBlogs();
    return NextResponse.json(posts);
  } catch (err) {
    console.log("인기글 조회 실패 : ", err);
    return NextResponse.json({ error: "인기글 조회 실패" }, { status: 500 });
  }
}
