export function initials(nameOrEmail?: string) {
  if (!nameOrEmail) return "U";
  const s = nameOrEmail.trim();
  const parts = s.includes("@")
    ? s.split("@")[0].split(/[.\s_-]+/)
    : s.split(/\s+/);
  const picks = parts
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "");
  return picks.join("") || "U";
}
