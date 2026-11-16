export function safeRelativePath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  return value;
}

export function safeAdminRedirect(value: string | null | undefined): string {
  const path = safeRelativePath(value, "/admin");
  return /^\/admin(?:[/?#]|$)/.test(path) ? path : "/admin";
}
