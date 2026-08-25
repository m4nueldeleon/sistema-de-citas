import { config } from "./negocio";
import type { Cita } from "./tipos";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function aClave(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

export function desdeInicio(inicio: string): Date {
  const [fecha, hora] = inicio.split("T");
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = (hora ?? "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function textoLargo(inicio: string): string {
  const d = desdeInicio(inicio);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}, ${textoHora(inicio)}`;
}

export function textoCorto(inicio: string): string {
  const d = desdeInicio(inicio);
  return `${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`;
}

export function textoHora(inicio: string): string {
  const d = desdeInicio(inicio);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const sufijo = h >= 12 ? "pm" : "am";
  h = h % 12 === 0 ? 12 : h % 12;
  return `${h}:${m} ${sufijo}`;
}

function minutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Días con horarios disponibles, a partir de hoy. */
export function diasDisponibles(ocupados: string[]): { clave: string; fecha: Date; horarios: string[] }[] {
  const { agenda } = config;
  const ahora = new Date();
  const minimo = new Date(ahora.getTime() + agenda.anticipacionHoras * 60 * 60 * 1000);
  const resultado: { clave: string; fecha: Date; horarios: string[] }[] = [];
  const tomados = new Set(ocupados);

  for (let i = 0; i < agenda.diasAdelante; i += 1) {
    const dia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + i);
    if (!agenda.dias.includes(dia.getDay())) continue;

    const horarios: string[] = [];
    const fin = minutos(agenda.horaFin);
    for (let t = minutos(agenda.horaInicio); t + agenda.duracionMinutos <= fin; t += agenda.duracionMinutos) {
      const h = String(Math.floor(t / 60)).padStart(2, "0");
      const m = String(t % 60).padStart(2, "0");
      const inicio = `${aClave(dia)}T${h}:${m}`;
      if (tomados.has(inicio)) continue;
      if (desdeInicio(inicio) < minimo) continue;
      horarios.push(inicio);
    }
    if (horarios.length > 0) resultado.push({ clave: aClave(dia), fecha: dia, horarios });
  }
  return resultado;
}

export function esHoy(inicio: string): boolean {
  return aClave(desdeInicio(inicio)) === aClave(new Date());
}

export function ordenarPorFecha(citas: Cita[]): Cita[] {
  return [...citas].sort((a, b) => a.inicio.localeCompare(b.inicio));
}
