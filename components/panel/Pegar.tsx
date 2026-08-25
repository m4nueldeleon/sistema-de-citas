"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Boton } from "@/components/ui/Boton";
import { config } from "@/lib/negocio";
import { textoLargo } from "@/lib/fechas";
import { decodificarCita } from "@/lib/codigo";
import { buscarCita, guardarCita, nuevoId } from "@/lib/almacen";
import type { Cita } from "@/lib/tipos";

const PRIMERA = config.crm.etapas[0];

function conEtapaValida(cita: Cita): Cita {
  const existe = config.crm.etapas.some((e) => e.id === cita.etapa);
  return existe ? cita : { ...cita, etapa: PRIMERA?.id ?? "nuevo" };
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
      `Listo: ${detectada.respuestas.nombre?.trim() || "la cita"} ya está en tu tablero, en «${
        PRIMERA?.nombre ?? "la primera columna"
      }».`,
    );
  }

  return (
    <div className="space-y-6">
      <section aria-label="Pegar el código que llegó por WhatsApp" className="tarjeta p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl">Pega el mensaje de WhatsApp</h2>
        <p className="mt-2 max-w-prose text-tinta-suave">
          Cuando alguien aparta cita en tu página, te manda un mensaje con su código. Pégalo aquí
          completo y la cita entra sola, con todo lo que contestó. No hay sincronización
          automática: este es el puente, y lo cruzas tú en dos segundos.
        </p>

        <label htmlFor="pegado" className="etiqueta mt-6">
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
          className="campo"
        />

        {detectada ? (
          <div className="mt-4 rounded-xl border border-marca p-4" aria-live="polite">
            <p className="text-[0.8125rem] uppercase tracking-wide text-tinta-suave">
              Reconocí esta cita
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-tinta">
              {detectada.respuestas.nombre?.trim() || "Sin nombre"}
            </p>
            <p className="mt-0.5 text-tinta-suave">{textoLargo(detectada.inicio)}</p>

            {yaEstaba ? (
              <p className="mt-3 text-amber-200">
                Esta cita ya estaba en tu tablero. Si la agregas otra vez, se actualiza: no se
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
          <p className="mt-4 leading-relaxed text-amber-200" aria-live="polite">
            No encontré el código en ese texto. Busca en el mensaje la parte que empieza con{" "}
            <strong className="text-tinta">CITA-</strong> y cópiala completa, sin cortarla. Si esa
            persona te escribió a mano y no tiene código, anótala aquí abajo.
          </p>
        ) : null}

        {aviso ? (
          <p role="status" className="mt-4 font-medium text-tinta">
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
      setAviso("");
      setError("Me faltan datos: nombre, WhatsApp, día y hora.");
      return;
    }

    const cita: Cita = {
      id: nuevoId(),
      inicio: `${dia}T${hora}`,
      duracionMinutos: config.agenda.duracionMinutos,
      etapa: PRIMERA?.id ?? "nuevo",
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
    setAviso(`Anotado: ${cita.respuestas.nombre}, el ${textoLargo(cita.inicio)}.`);
  }

  return (
    <section aria-label="Anotar una cita a mano" className="tarjeta p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl">O anótala a mano</h2>
      <p className="mt-2 max-w-prose text-tinta-suave">
        Para la gente que te agenda por teléfono o en persona.
      </p>

      <form onSubmit={guardar} className="mt-6 space-y-5">
        <div>
          <label htmlFor="alta-nombre" className="etiqueta">
            ¿Cómo se llama?
          </label>
          <input
            id="alta-nombre"
            type="text"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="alta-whatsapp" className="etiqueta">
            Su WhatsApp (con lada)
          </label>
          <input
            id="alta-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="52 33 1234 5678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="campo"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="alta-dia" className="etiqueta">
              Día
            </label>
            <input
              id="alta-dia"
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className="campo"
            />
          </div>
          <div>
            <label htmlFor="alta-hora" className="etiqueta">
              Hora
            </label>
            <input
              id="alta-hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="campo"
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="font-medium text-red-300">
            {error}
          </p>
        ) : null}

        <Boton tipo="submit">Guardar la cita</Boton>

        {aviso ? (
          <p role="status" className="font-medium text-tinta">
            {aviso}
          </p>
        ) : null}
      </form>
    </section>
  );
}
