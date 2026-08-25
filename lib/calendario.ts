import { config } from "./negocio";
import { desdeInicio } from "./fechas";
import type { Cita } from "./tipos";

function marca(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

function escapar(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Archivo .ics generado en el navegador: no necesita servidor. */
export function contenidoIcs(cita: Cita): string {
  const inicio = desdeInicio(cita.inicio);
  const fin = new Date(inicio.getTime() + cita.duracionMinutos * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sistema-de-citas//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${cita.id}@sistema-de-citas`,
    `DTSTAMP:${marca(new Date())}`,
    `DTSTART;TZID=${config.agenda.zonaHoraria}:${marca(inicio)}`,
    `DTEND;TZID=${config.agenda.zonaHoraria}:${marca(fin)}`,
    `SUMMARY:${escapar(`${config.oferta.nombre} · ${config.negocio.nombre}`)}`,
    `DESCRIPTION:${escapar(`Cita apartada en ${config.negocio.nombre}. Cualquier cambio, escribe por WhatsApp.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function ligaGoogleCalendar(cita: Cita): string {
  const inicio = desdeInicio(cita.inicio);
  const fin = new Date(inicio.getTime() + cita.duracionMinutos * 60 * 1000);
  const parametros = new URLSearchParams({
    action: "TEMPLATE",
    text: `${config.oferta.nombre} · ${config.negocio.nombre}`,
    dates: `${marca(inicio)}/${marca(fin)}`,
    details: `Cita apartada en ${config.negocio.nombre}.`,
    ctz: config.agenda.zonaHoraria,
  });
  return `https://calendar.google.com/calendar/render?${parametros.toString()}`;
}

export function descargarIcs(cita: Cita): void {
  const blob = new Blob([contenidoIcs(cita)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mi-cita.ics";
  a.click();
  URL.revokeObjectURL(url);
}
