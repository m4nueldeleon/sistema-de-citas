export type CampoTipo = "texto" | "tel" | "correo" | "parrafo" | "opciones";

export type Campo = {
  id: string;
  etiqueta: string;
  tipo: CampoTipo;
  requerido: boolean;
  opciones?: string[];
};

export type Etapa = { id: string; nombre: string };

export type Config = {
  negocio: {
    nombre: string;
    logoTexto: string;
    whatsapp: string;
    correo: string;
    ciudad: string;
    sitio: string;
  };
  marca: { colorPrincipal: string; colorAcento: string; modo: "oscuro" | "claro" };
  oferta: {
    nombre: string;
    duracionMinutos: number;
    precioTexto: string;
    incluye: string[];
  };
  landing: {
    titular: string;
    subtitular: string;
    ctaTexto: string;
    urgencia: string;
    dolores: { titulo: string; texto: string }[];
    beneficios: { titulo: string; texto: string }[];
    paraQuien: string[];
    noParaQuien: string[];
    preguntas: { p: string; r: string }[];
    prueba: { activa: boolean; items: { texto: string; autor: string }[] };
  };
  agenda: {
    zonaHoraria: string;
    dias: number[];
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
    anticipacionHoras: number;
    diasAdelante: number;
  };
  formulario: { campos: Campo[] };
  gracias: { titulo: string; mensaje: string; pasos: string[] };
  crm: { pin: string; etapas: Etapa[] };
  integraciones: { webhookUrl: string };
};

/** Una cita reservada. `inicio` es ISO local sin zona: 2026-08-25T10:00 */
export type Cita = {
  id: string;
  inicio: string;
  duracionMinutos: number;
  etapa: string;
  creada: string;
  respuestas: Record<string, string>;
  notas: { fecha: string; texto: string }[];
  origen: string;
};
