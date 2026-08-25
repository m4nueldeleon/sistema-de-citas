import { config } from "./negocio";
import { codificarCita } from "./codigo";
import { textoLargo } from "./fechas";
import type { Cita } from "./tipos";

function soloDigitos(numero: string): string {
  return numero.replace(/\D/g, "");
}

/** Mensaje que el prospecto manda al negocio: confirma y carga la cita al panel. */
export function ligaConfirmacion(cita: Cita): string {
  const nombre = cita.respuestas.nombre || "Hola";
  const mensaje = [
    `Hola, soy ${nombre}.`,
    `Aparté mi ${config.oferta.nombre.toLowerCase()} para el ${textoLargo(cita.inicio)}.`,
    "",
    "Este es mi código de cita:",
    codificarCita(cita),
  ].join("\n");
  return `https://wa.me/${soloDigitos(config.negocio.whatsapp)}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje que el negocio manda al prospecto desde el panel. */
export function ligaSeguimiento(cita: Cita, texto: string): string {
  const numero = soloDigitos(cita.respuestas.whatsapp ?? "");
  if (!numero) return "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function textoRecordatorio(cita: Cita): string {
  const nombre = cita.respuestas.nombre || "";
  return `Hola ${nombre}, te confirmo tu ${config.oferta.nombre.toLowerCase()} el ${textoLargo(cita.inicio)}. ¿Sigue en pie?`;
}
