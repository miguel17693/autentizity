import type { NextRequest } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth/session";
import { safeRelativePath } from "@/lib/auth/redirect";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const target = safeRelativePath(searchParams.get("redirect"), "/");
  const draft = await draftMode();

  if (searchParams.get("enable") === "0") {
    draft.disable();
    redirect(target);
  }

  if (!(await isAdminRequest(request))) {
    redirect(`/admin/login?from=${encodeURIComponent("/admin")}`);
  }

  draft.enable();
  redirect(target);
}
