import { lucia } from "./auth";
import { getUserNickName } from "./blog-db";

const { cookies } = require("next/headers");

export default async function UserSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  if (!sessionId) return null;

  const { session, user } = await lucia.validateSession(sessionId);
  console.log("🔥 Lucia Session:", session);
  console.log("🔥 Lucia User:", user);
  if (!session || !user) return null;

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  const nickNameRes = await getUserNickName(user.id);
  const nickName = nickNameRes.nick_name;
  return {
    ...user,
    isAdmin,
    nickName,
  };
}
