import { NextResponse } from "next/server";
import { selectCategory } from "../../../lib/blog-db";

//api 라우터는 무조건 app 폴더 하위에 존재해야함.
// 클라이언트 컴포넌트에서 직접 better-sqlite3 호출하면 안되기 때문에 api라우터를 통해서 짆애
export async function GET() {
  try {
    const categories = await selectCategory();
    return NextResponse.json(categories);
  } catch (err) {
    console.log("카테고리 조회 오류 : ", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
