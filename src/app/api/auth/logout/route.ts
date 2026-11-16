import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { ADMIN_HINT_COOKIE, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  (await draftMode()).disable();
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(ADMIN_HINT_COOKIE);
  return response;
}
