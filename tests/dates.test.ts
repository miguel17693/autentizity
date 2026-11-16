import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isEventInCurrentMonth, isPastEvent, isUpcomingEvent, parseSiteDate } from "@/lib/dates";
import { formatDate, formatDateTime } from "@/lib/utils";

const at = (iso: string) => vi.setSystemTime(new Date(iso));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("event dates in Madrid time", () => {
  it("reads stored wall-clock values as Madrid time across DST", () => {
    expect(parseSiteDate("2026-11-20T18:00")?.toISOString()).toBe("2026-11-20T17:00:00.000Z");
    expect(parseSiteDate("2026-07-20T18:00")?.toISOString()).toBe("2026-07-20T16:00:00.000Z");
    expect(parseSiteDate("2026-07-20T18:00:00.000Z")?.toISOString()).toBe("2026-07-20T18:00:00.000Z");
    expect(parseSiteDate("2026-07-20T18:00+02:00")?.toISOString()).toBe("2026-07-20T16:00:00.000Z");
    expect(parseSiteDate("2026-11-20")?.toISOString()).toBe("2026-11-19T23:00:00.000Z");
    expect(parseSiteDate("no es una fecha")).toBeNull();
  });

  it("drops an event that ended in Madrid even if the UTC clock is earlier", () => {
    at("2026-11-20T17:30:00Z");
    expect(isUpcomingEvent({ startDate: "2026-11-20T18:00" })).toBe(false);
    expect(isPastEvent({ startDate: "2026-11-20T18:00" })).toBe(true);
    at("2026-07-20T16:30:00Z");
    expect(isUpcomingEvent({ startDate: "2026-07-20T18:00" })).toBe(false);
  });

  it("keeps an event later today and drops one earlier today", () => {
    at("2026-11-20T11:00:00Z");
    expect(isUpcomingEvent({ startDate: "2026-11-20T19:00" })).toBe(true);
    expect(isUpcomingEvent({ startDate: "2026-11-20T09:00" })).toBe(false);
  });

  it("keeps a multi-day event visible until it ends", () => {
    at("2026-11-21T12:00:00Z");
    const event = { startDate: "2026-11-20T09:00", endDate: "2026-11-22T14:00" };
    expect(isUpcomingEvent(event)).toBe(true);
    expect(isPastEvent(event)).toBe(false);
    at("2026-11-22T13:30:00Z");
    expect(isPastEvent(event)).toBe(true);
  });

  it("treats a date without time as the end of that Madrid day", () => {
    at("2026-11-20T22:30:00Z");
    expect(isUpcomingEvent({ startDate: "2026-11-20" })).toBe(true);
    at("2026-11-20T23:00:00Z");
    expect(isPastEvent({ startDate: "2026-11-20" })).toBe(true);
  });

  it("ignores events without a valid date", () => {
    expect(isUpcomingEvent({ startDate: "" })).toBe(false);
    expect(isPastEvent({ startDate: "pronto" })).toBe(false);
  });
});

describe("this month filter", () => {
  it("includes events on the last evening of the month", () => {
    at("2026-11-10T10:00:00Z");
    expect(isEventInCurrentMonth({ startDate: "2026-11-30T20:00" })).toBe(true);
    expect(isEventInCurrentMonth({ startDate: "2026-12-01T00:00" })).toBe(false);
    expect(isEventInCurrentMonth({ startDate: "2026-10-31T20:00" })).toBe(false);
  });

  it("uses the Madrid month when UTC is still in the previous one", () => {
    at("2026-11-30T23:30:00Z");
    expect(isEventInCurrentMonth({ startDate: "2026-12-01T10:00" })).toBe(true);
    expect(isEventInCurrentMonth({ startDate: "2026-11-30T20:00" })).toBe(false);
  });

  it("rolls over from December to January", () => {
    at("2026-12-15T10:00:00Z");
    expect(isEventInCurrentMonth({ startDate: "2026-12-31T21:00" })).toBe(true);
    expect(isEventInCurrentMonth({ startDate: "2027-01-01T10:00" })).toBe(false);
  });

  it("includes events that started earlier and are still running this month", () => {
    at("2026-11-02T10:00:00Z");
    expect(isEventInCurrentMonth({ startDate: "2026-10-30T09:00", endDate: "2026-11-03T18:00" })).toBe(true);
  });
});

describe("date formatting", () => {
  it("shows stored times as Madrid wall-clock time", () => {
    expect(formatDateTime("2026-11-20T18:00")).toMatch(/20 de noviembre de 2026.*18:00/);
    expect(formatDate("2026-11-30T23:30")).toBe("30 de noviembre de 2026");
    expect(formatDate("2026-11-30T23:30:00Z")).toBe("1 de diciembre de 2026");
    expect(formatDate("")).toBe("");
  });
});
