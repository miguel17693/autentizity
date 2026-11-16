import { cookies, draftMode } from "next/headers";
import { SESSION_COOKIE, getSessionSecret, verifySessionToken } from "./session";

export async function isAdminPreview(): Promise<boolean> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, getSessionSecret());
}
