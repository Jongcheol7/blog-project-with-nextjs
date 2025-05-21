import { NextResponse } from "next/server";
import {
  deleteBlog,
  deleteBlogTags,
  deleteTags,
  selectBlog,
  selectBlogs,
} from "@lib/blog-db";
import { deletePostAssets } from "@lib/cloudinary";

// 블로그 조회 함수
export async function POST(request) {
  const { userId } = await request.json();
  try {
    console.log("블로그 목록 조회 시작 !!", userId);
    const posts = await selectBlogs(userId);
    return NextResponse.json(posts);
  } catch (err) {
    console.log("블로그 목록 조회 오류 : ", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// 블로그 글 삭제 함수
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const postNo = searchParams.get("postNo");
  if (!postNo) {
    return NextResponse.json({ error: "글 번호가 없습니다" }, { status: 400 });
  }

  let post;
  try {
    post = await selectBlog(postNo);
  } catch (err) {
    console.log("블로그 조회 오류 : ", err);
    return NextResponse.json({ error: "블로그 조회 오류" }, { status: 500 });
  }

  try {
    await deletePostAssets(post);
  } catch (err) {
    console.log("클라우디너리 사진 삭제 오류 : ", err);
    return NextResponse.json(
      { error: "클라우디너리 사진 삭제 오류" },
      { status: 500 }
    );
  }

  try {
    console.log("태그 삭제전");
    await deleteBlogTags(postNo);
    console.log("블로그-태그 삭제 완료");
    await deleteTags(postNo);
    console.log("태그 삭제 완료");
    await deleteBlog(postNo);
    console.log("블로그 삭제 완료");
  } catch (err) {
    console.log("블로그 글삭제 오류 : ", err);
    return NextResponse.json({ error: "블로그 글삭제 오류" }, { status: 500 });
  }

  return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
}
