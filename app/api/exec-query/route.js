import { NextResponse } from "next/server";
import execQuery from "@lib/manager-db";

export async function POST(request) {
  const { query } = await request.json();
  try {
    const result = await execQuery(query);
    return NextResponse.json({
      seccess: true,
      changes: result.changes,
    });
  } catch (err) {
    console.log("쿼리 수행 실패 : ", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
