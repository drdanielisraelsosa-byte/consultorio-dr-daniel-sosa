export function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function displayDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return parseDate(value).toLocaleDateString(
    "es-MX",
    options ?? { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );
}

export function mondayOf(date: Date) {
  const copy = new Date(date);
  const delta = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - delta);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function slotLabel(hour: number) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour));
}

export function canBook(date: string, hour: number) {
  const target = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00-06:00`);
  return (
    target.getTime() - Date.now() >= 30 * 60 * 1000 &&
    parseDate(date).getDay() !== 0 &&
    target >= new Date(2026, 7, 1) &&
    target <= new Date(2030, 11, 31, 23, 59)
  );
}
