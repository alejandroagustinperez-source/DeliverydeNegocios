import { cookies } from "next/headers";
import { computeAdminToken, ADMIN_COOKIE_NAME } from "./adminToken";

export async function setAdminSession(): Promise<void> {
  const token = await computeAdminToken();
  if (!token) return;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await computeAdminToken();
  if (!token) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === token;
}
