"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Boton } from "@/components/ui/Boton";
import { config } from "@/lib/negocio";
import { textoLargo } from "@/lib/fechas";
import { decodificarCita } from "@/lib/codigo";
import { buscarCita, guardarCita, nuevoId } from "@/lib/almacen";
import type { Cita } from "@/lib/tipos";

const PRIMERA_ETAPA = config.crm.etapas[0]?.id ?? "nuevo";

function conEtapaValida(cita: Cita): Cita {
  const existe = config.crm.etapas.some((e) => e.id === cita.etapa);
  return existe ? cita : { ...cita, etapa: PRIMERA_ETAPA };
}

export function Pegar({ recargar }: { recargar: () => void }) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");

  const detectada = useMemo(() => decodificarCita(texto), [texto]);
  const yaEstaba = detectada ? Boolean(buscarCita(detectada.id)) : false;

  function agregar() {
    if (!detectada) return;
    guardarCita(conEtapaValida(detectada));
    recargar();
    setTexto("");
    setAviso(
      `Listo: ${detectada.respuestas.nombre?.trim() || "la cita"} ya está en tu tablero, en "${
        config.crm.etapas[0]?.nombre ?? "la primera etapa"
      }".`,
    );
  }

  return (
    <div className="space-y-8">
      <section
        aria-label="Pegar el código que te llegó por WhatsApp"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          Pega el mensaje de WhatsApp
        </h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-white/70">
          Cuando alguien aparta cita en tu página, te manda un mensaje con su código. Pégalo aquí
          completo y la cita entra sola, con todo lo que contestó.
        </p>

        <label htmlFor="pegado" className="mt-5 block text-base font-medium text-white">
          Pega aquí el mensaje que te llegó por WhatsApp
        </label>
        <textarea
          id="pegado"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAviso("");
          }}
          rows={5}
          placeholder="Hola, soy Ana. Aparté mi sesión… Este es mi código de cita: CITA-…"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
        />

        {detectada ? (
          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: "var(--marca)" }}
            aria-live="polite"
          >
            <p className="text-sm uppercase tracking-wide text-white/50">Reconocí esta cita</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {detectada.respuestas.nombre?.trim() || "Sin nombre"}
            </p>
            <p className="mt-0.5 text-base text-white/70">{textoLargo(detectada.inicio)}</p>

            {yaEstaba ? (
              <p className="mt-3 text-base text-amber-200">
                Esta cita ya estaba en tu tablero. Si la agregas otra vez, se queda igual: no se
                duplica.
              </p>
            ) : null}

            <div className="mt-4">
              <Boton onClick={agregar}>
                {yaEstaba ? "Actualizar la cita" : "Agregar al tablero"}
              </Boton>
            </div>
          </div>
        ) : null}

        {!detectada && texto.trim() !== "" ? (
          <p className="mt-4 text-base leading-relaxed text-amber-200" aria-live="polite">
            No encontré el código en ese texto. Busca en el mensaje la parte que empieza con{" "}
            <strong className="text-white">CITA-</strong> y cópiala completa, sin cortarla. Si esa
            persona te escribió a mano y no tiene código, dala de alta aquí abajo.
          </p>
        ) : null}

        {aviso ? (
          <p className="mt-4 text-base font-medium text-white" role="status">
            {aviso}
          </p>
        ) : null}
      </section>

      <AltaManual recargar={recargar} />
    </div>
  );
}

function AltaManual({ recargar }: { recargar: () => void }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!nombre.trim() || !whatsapp.trim() || !dia || !hora) {
      setError("Me faltan datos: nombre, WhatsApp, día y hora.");
      return;
    }

    const cita: Cita = {
      id: nuevoId(),
      inicio: `${dia}T${hora}`,
      duracionMinutos: config.agenda.duracionMinutos,
      etapa: PRIMERA_ETAPA,
      creada: new Date().toISOString(),
      respuestas: { nombre: nombre.trim(), whatsapp: whatsapp.trim() },
      notas: [],
      origen: "captura a mano",
    };

    guardarCita(cita);
    recargar();
    setNombre("");
    setWhatsapp("");
    setDia("");
    setHora("");
    setError("");
    setAviso(`Anotado: ${cita.respuestas.nombre} el ${textoLargo(cita.inicio)}.`);
  }

  return (
    <section
      aria-label="Anotar una cita a mano"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
    >
      <h2 className="text-xl font-semibold text-white sm:text-2xl">O anótala a mano</h2>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-white/70">
        Para la gente que te agenda por teléfono o en persona.
      </p>

      <form onSubmit={guardar} className="mt-5 space-y-4">
        <Campo id="alta-nombre" etiqueta="¿Cómo se llama?">
          <input
            id="alta-nombre"
            type="text"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          />
        </Campo>

        <Campo id="alta-whatsapp" etiqueta="Su WhatsApp (con lada)">
          <input
            id="alta-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="52 33 1234 5678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="alta-dia" etiqueta="Día">
            <input
              id="alta-dia"
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            />
          </Campo>
          <Campo id="alta-hora" etiqueta="Hora">
            <input
              id="alta-hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            />
          </Campo>
        </div>

        {error ? (
          <p role="alert" className="text-base font-medium text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center justify-center rounded-2xl px-6 text-base font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          style={{ backgroundColor: "var(--marca)" }}
        >
          Guardar la cita
        </button>

        {aviso ? (
          <p role="status" className="text-base font-medium text-white">
            {aviso}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function Campo({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-white">
        {etiqueta}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
