"use client";

// Shared day logic for the calendar views (stories, 3D ring, timeline, countdown).
import { useCallback, useSyncExternalStore } from "react";
import { dayDate, months, site } from "@/content/site";

export type DayState = "locked" | "preview" | "open";
export const N = site.days;

const weekday = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
// Date parts in the release time zone (Puerto Rico, UTC-4), whatever the visitor's own zone is.
const pr = (d: Date) => new Date(d.getTime() - 4 * 3600_000);
export const label = (n: number) => {
  const d = pr(dayDate(n));
  return `${weekday[d.getUTCDay()]} ${d.getUTCDate()} de ${months[d.getUTCMonth()]}`;
};
export const short = (n: number) => `${pr(dayDate(n)).getUTCDate()} feb`;

// Current time. Null while prerendering, so the static HTML does not depend on the build date.
const every = (ms: number) => (cb: () => void) => {
  const id = window.setInterval(cb, ms);
  return () => window.clearInterval(id);
};
const subscribeMinute = every(60_000);
const subscribeSecond = every(1_000);
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const secondNow = () => Math.floor(Date.now() / 1_000) * 1_000;
export const useNow = () => useSyncExternalStore<number | null>(subscribeMinute, minuteNow, () => null);
export const useClock = () => useSyncExternalStore<number | null>(subscribeSecond, secondNow, () => null);

/** Day 1 opens as a preview before launch; every day opens on its date. */
export function useDayState() {
  const now = useNow();
  const state = useCallback(
    (n: number): DayState => {
      if (now !== null && now >= dayDate(n).getTime()) return "open";
      return n === 1 ? "preview" : "locked";
    },
    [now],
  );
  return { now, state };
}

/** Any view can ask the calendar to open a day; the stories section shows it. */
export const OPEN_DAY = "calendar:open-day";
export const requestOpenDay = (n: number) => window.dispatchEvent(new CustomEvent<number>(OPEN_DAY, { detail: n }));
