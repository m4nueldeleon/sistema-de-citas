import type { Cita } from "./tipos";

const PREFIJO = "CITA-";

function aBase64(texto: string): string {
  const bytes = new TextEncoder().encode(texto);
  let binario = "";
  bytes.forEach((b) => {
    binario += String.fromCharCode(b);
  });
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function desdeBase64(texto: string): string {
  const normal = texto.replace(/-/g, "+").replace(/_/g, "/");
  const relleno = normal + "=".repeat((4 - (normal.length % 4)) % 4);
  const binario = atob(relleno);
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Convierte una cita en un código corto que el prospecto manda por WhatsApp.
 * El dueño lo pega en su panel y la cita entra completa, sin teclear nada.
 */
export function codificarCita(cita: Cita): string {
  const compacto = {
    i: cita.id,
    f: cita.inicio,
    d: cita.duracionMinutos,
    r: cita.respuestas,
    o: cita.origen,
  };
  return PREFIJO + aBase64(JSON.stringify(compacto));
}

export function decodificarCita(texto: string): Cita | null {
  const encontrado = texto.match(/CITA-[A-Za-z0-9\-_]+/);
  if (!encontrado) return null;
  try {
    const compacto = JSON.parse(desdeBase64(encontrado[0].slice(PREFIJO.length)));
    if (!compacto?.i || !compacto?.f) return null;
    return {
      id: String(compacto.i),
      inicio: String(compacto.f),
      duracionMinutos: Number(compacto.d) || 30,
      etapa: "nuevo",
      creada: new Date().toISOString(),
      respuestas: (compacto.r ?? {}) as Record<string, string>,
      notas: [],
      origen: String(compacto.o ?? "whatsapp"),
    };
  } catch {
    return null;
  }
}
