const PUBLIC_STATUSES = new Set(["published", "cancelled"]);

export function isPubliclyVisible(item: { status: string }): boolean {
  return PUBLIC_STATUSES.has(item.status);
}

export function onlyPublic<T extends { status: string }>(items: T[]): T[] {
  return items.filter(isPubliclyVisible);
}
