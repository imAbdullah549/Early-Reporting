import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import type { RootState } from "../../app/store";

export const selectFilters = (s: RootState) => s.filters;
export const selectReportData = (s: RootState) => s.report.data;

export const selectEntries = createSelector(
  selectReportData,
  (d) => d?.timeEntries ?? []
);
// --- Aggregations for charts ---
export const selectMinutesPerProject = createSelector(selectEntries, (rows) => {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = r.activity?.name ?? "Unknown";
    const start = dayjs(r.duration.startedAt);
    const end = dayjs(r.duration.stoppedAt);
    const minutes = Math.max(0, end.diff(start, "minute"));
    map.set(key, (map.get(key) ?? 0) + minutes);
  }
  return Array.from(map, ([name, minutes]) => ({ name, minutes })).sort(
    (a, b) => b.minutes - a.minutes
  );
});

export const selectMinutesPerUser = createSelector(selectEntries, (rows) => {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = r.user?.email || r.user?.name || "Unknown";
    const start = dayjs(r.duration.startedAt);
    const end = dayjs(r.duration.stoppedAt);
    const minutes = Math.max(0, end.diff(start, "minute"));
    map.set(key, (map.get(key) ?? 0) + minutes);
  }
  return Array.from(map, ([name, minutes]) => ({ name, minutes })).sort(
    (a, b) => b.minutes - a.minutes
  );
});

// --- Quick KPIs ---
export const selectKpis = createSelector(selectEntries, (rows) => {
  let totalMin = 0;
  const users = new Set<string>();
  for (const r of rows) {
    const s = dayjs(r.duration.startedAt);
    const e = dayjs(r.duration.stoppedAt);
    totalMin += Math.max(0, e.diff(s, "minute"));
    const u = r.user?.email || r.user?.id;
    if (u) users.add(u);
  }
  return {
    totalHours: +(totalMin / 60).toFixed(1),
    entryCount: rows.length,
    distinctUsers: users.size,
  };
});
