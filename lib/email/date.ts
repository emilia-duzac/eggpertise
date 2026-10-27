const TIME_ZONE = "America/Argentina/Buenos_Aires";

/** Current date and time as shown in the footer of the team notifications. */
export function notificationDate(now = new Date()): string {
  return now.toLocaleString("es-AR", { timeZone: TIME_ZONE });
}
