import { lucia } from "./auth";

const { cookies } = require("next/headers");

export default async function UserSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  if (!sessionId) return null;

  const { session, user } = await lucia.validateSession(sessionId);
  console.log("🔥 Lucia Session:", session);
  console.log("🔥 Lucia User:", user);
  console.log("🔥 Lucia id:", user.id);
  console.log("🔥 Lucia email:", user.email);
  if (!session || !user) return null;

  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  return {
    ...user,
    isAdmin,
  };
}
