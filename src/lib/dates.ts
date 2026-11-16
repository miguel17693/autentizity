import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const SITE_TIME_ZONE = "Europe/Madrid";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const EXPLICIT_OFFSET = /T[\d:.]+(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

type EventDates = { startDate: string; endDate?: string };

/**
 * Event and news dates are stored as wall-clock text (e.g. `2026-11-20T18:00`)
 * without offset; they always refer to Madrid local time, regardless of the
 * server time zone. Values carrying an explicit offset keep it.
 */
export function parseSiteDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const text = value instanceof Date ? "" : value.trim();
  const date = value instanceof Date
    ? value
    : EXPLICIT_OFFSET.test(text)
      ? new Date(text)
      : fromZonedTime(text, SITE_TIME_ZONE);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseEventBoundary(value: string | undefined): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return parseSiteDate(DATE_ONLY.test(trimmed) ? `${trimmed}T23:59:59.999` : trimmed);
}

export function getEventEnd(event: EventDates): Date | null {
  const start = parseEventBoundary(event.startDate);
  const end = parseEventBoundary(event.endDate);
  if (!start || !end) return end ?? start;
  return end > start ? end : start;
}

export function isUpcomingEvent(event: EventDates, now: Date = new Date()): boolean {
  const end = getEventEnd(event);
  return end !== null && end >= now;
}

export function isPastEvent(event: EventDates, now: Date = new Date()): boolean {
  const end = getEventEnd(event);
  return end !== null && end < now;
}

export function isEventInCurrentMonth(event: EventDates, now: Date = new Date()): boolean {
  const start = parseSiteDate(event.startDate);
  const end = getEventEnd(event);
  if (!start || !end) return false;
  const monthKey = formatInTimeZone(now, SITE_TIME_ZONE, "yyyy-MM");
  const [year, month] = monthKey.split("-").map(Number);
  const nextMonthKey = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 7);
  const monthStart = fromZonedTime(`${monthKey}-01T00:00`, SITE_TIME_ZONE);
  const nextMonthStart = fromZonedTime(`${nextMonthKey}-01T00:00`, SITE_TIME_ZONE);
  return start < nextMonthStart && end >= monthStart;
}
