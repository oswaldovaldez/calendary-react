import { formatDistanceToNow, isBefore, subHours } from "date-fns";
import { es } from "date-fns/locale";

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Si pasó más de 24h, muestra la fecha
  if (isBefore(date, subHours(now, 24))) {
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: es })
    .replace("aproximadamente ", "")
    .replace("alrededor de ", "")
    .replace("unos ", "")
    .replace("menos de ", "")
    .replace("casi ", "");
}
