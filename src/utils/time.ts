import dayjs from "dayjs";

export function formatHours(decimalHours: number) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export function fmt(iso: string) {
  return dayjs(iso).format("YYYY-MM-DD HH:mm");
}

export function durMin(a: string, b: string) {
  const m = dayjs(b).diff(dayjs(a), "minute");
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh}h ${mm}m`;
}
