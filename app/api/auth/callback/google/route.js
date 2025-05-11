import { lucia } from "@lib/auth";
import { findUserById, insertUser } from "@lib/blog-db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 환경변수에서 Client ID / Secret 불러옴
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/google";

export async function GET(req) {
  const url = new URL(req.url);

  // URL에서 code/state 파라미터 추출
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // 쿠키에서 저장해둔 state 값 가져오기
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;

  // 보안 체크: state 불일치 시 오류
  if (!code || !state || state !== storedState) {
    return new Response("Invalid state", { status: 400 });
  }

  // 1. Google에 토큰 요청
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const { access_token } = await tokenRes.json();

  // 2. 액세스 토큰으로 사용자 정보 가져오기
  const userInfoRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  const { id, email } = await userInfoRes.json();

  // 3. 유저가 DB에 없으면 생성, 있으면 가져오기
  //  유저 정보 DB에서 확인
  let user = await findUserById(id);
  //  없으면 새로 추가
  if (!user) {
    await insertUser({ id, email });
    user = await findUserById(id);
  }

  console.log("user : ", user);

  // 4. 세션 생성
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  // 5. 쿠키에 세션 저장
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // 로그인 완료 후 홈으로 리다이렉트
  redirect("/");
}
