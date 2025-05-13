import { selectComments } from "@lib/blog-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const comments = await selectComments();
    return NextResponse.json(comments);
  } catch (err) {
    console.log("댓글 조회 실패 : ", err);
    return NextResponse.json({ error: "댓글 조회 실패" }, { status: 500 });
  }
}
