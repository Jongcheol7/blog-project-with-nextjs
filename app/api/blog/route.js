import { NextResponse } from "next/server";
import { selectBlogs } from "../../../lib/blog-db";

export async function GET() {
  const posts = await selectBlogs();
  return NextResponse.json(posts);
}
