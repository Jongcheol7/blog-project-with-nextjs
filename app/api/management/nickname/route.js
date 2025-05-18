import {
  getDuplicatedNickname,
  insertNickname,
  updateUserNickname,
} from "@lib/blog-db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { nickname, userId } = await request.json();
  console.log("nickname : ", nickname);
  if (!nickname && nickname.trim().length === 0) {
    return NextResponse.json({ error: "닉네임이 없습니다." }, { status: 400 });
  }

  //기존 등록된 닉네임인지 체크
  const res = await getDuplicatedNickname(nickname);
  if (!res) {
    // 닉네임 테이블 insert
    try {
      console.log("저장전 확인 : ", nickname, userId);
      await insertNickname(nickname, userId);
    } catch (err) {
      return NextResponse.json({ error: "닉네임 저장 실패" }, { status: 500 });
    }
    // 유저 테이블 update
    try {
      console.log("저장전 확인 2: ", nickname, userId);
      await updateUserNickname(nickname, userId);
    } catch (err) {
      return NextResponse.json(
        { error: "유저 정보 업데이트트 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } else {
    // 중복있음 (비정상)
    return NextResponse.json(
      { success: false, error: "이미 사용 중인 닉네임입니다." },
      { status: 409 }
    );
  }
}
