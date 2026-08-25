import { config } from "./negocio";
import type { Cita } from "./tipos";

/**
 * Envío opcional a una automatización (Make, Zapier, n8n, Google Apps Script).
 * Si no hay dirección configurada, no pasa nada: la cita ya quedó guardada.
 */
export async function avisarWebhook(cita: Cita): Promise<void> {
  const url = config.integraciones.webhookUrl?.trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        negocio: config.negocio.nombre,
        cita: {
          id: cita.id,
          inicio: cita.inicio,
          duracionMinutos: cita.duracionMinutos,
          origen: cita.origen,
          ...cita.respuestas,
        },
      }),
      keepalive: true,
    });
  } catch {
    /* la cita ya está guardada: una automatización caída no rompe la reserva */
  }
}
