export function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
