"use client";

import { useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { config } from "@/lib/negocio";
import { aClave, textoLargo } from "@/lib/fechas";
import { borrarCita, guardarCita, leerCitas } from "@/lib/almacen";
import type { Cita } from "@/lib/tipos";

function celda(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

function nombreEtapa(id: string): string {
  return config.crm.etapas.find((e) => e.id === id)?.nombre ?? id;
}

function aCsv(citas: Cita[]): string {
  const campos = config.formulario.campos;
  const encabezados = [
    "Día y hora",
    "Etapa",
    ...campos.map((c) => c.etiqueta),
    "Duración (minutos)",
    "Llegó por",
    "Se apartó el",
    "Notas",
  ];

  const filas = citas.map((cita) =>
    [
      textoLargo(cita.inicio),
      nombreEtapa(cita.etapa),
      ...campos.map((c) => cita.respuestas[c.id] ?? ""),
      String(cita.duracionMinutos),
      cita.origen,
      cita.creada,
      cita.notas.map((n) => n.texto).join(" | "),
    ]
      .map((v) => celda(String(v)))
      .join(","),
  );

  // El BOM le dice a Excel que el archivo trae acentos.
  return "\uFEFF" + [encabezados.map(celda).join(","), ...filas].join("\r\n");
}

function descargar(nombre: string, contenido: string, tipo: string): void {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

/** Reemplaza todo lo guardado por lo que viene del respaldo. */
function reemplazarTodo(nuevas: Cita[]): void {
  leerCitas().forEach((c) => borrarCita(c.id));
  nuevas.forEach((c) => guardarCita(c));
}

function esCita(valor: unknown): valor is Cita {
  if (typeof valor !== "object" || valor === null) return false;
  const c = valor as Partial<Cita>;
  return typeof c.id === "string" && typeof c.inicio === "string";
}

function normalizar(cita: Cita): Cita {
  return {
    id: cita.id,
    inicio: cita.inicio,
    duracionMinutos: Number(cita.duracionMinutos) || config.agenda.duracionMinutos,
    etapa: config.crm.etapas.some((e) => e.id === cita.etapa)
      ? cita.etapa
      : (config.crm.etapas[0]?.id ?? "nuevo"),
    creada: typeof cita.creada === "string" ? cita.creada : new Date().toISOString(),
    respuestas: typeof cita.respuestas === "object" && cita.respuestas ? cita.respuestas : {},
    notas: Array.isArray(cita.notas) ? cita.notas : [],
    origen: typeof cita.origen === "string" ? cita.origen : "respaldo",
  };
}

export function Datos({ citas, recargar }: { citas: Cita[]; recargar: () => void }) {
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");
  const [paso, setPaso] = useState<0 | 1 | 2>(0);
  const fecha = aClave(new Date());

  function descargarCsv() {
    if (citas.length === 0) {
      setError("Todavía no tienes citas que descargar.");
      return;
    }
    descargar(`citas-${fecha}.csv`, aCsv(citas), "text/csv;charset=utf-8");
    setError("");
    setAviso("Descargué tus citas en un archivo que abre en Excel o en Google Sheets.");
  }

  function descargarRespaldo() {
    descargar(
      `respaldo-citas-${fecha}.json`,
      JSON.stringify(citas, null, 2),
      "application/json;charset=utf-8",
    );
    setError("");
    setAviso("Guarda ese archivo en tu correo o en la nube. Es tu copia de seguridad.");
  }

  async function restaurar(entrada: HTMLInputElement) {
    const elegido = entrada.files?.[0];
    if (!elegido) return;
    try {
      const crudo = JSON.parse(await elegido.text());
      if (!Array.isArray(crudo)) throw new Error("formato");
      const validas = crudo.filter(esCita).map(normalizar);
      if (validas.length === 0) throw new Error("vacío");
      reemplazarTodo(validas);
      recargar();
      setError("");
      setAviso(
        `Restauré ${validas.length} ${validas.length === 1 ? "cita" : "citas"} del respaldo. Lo que había antes se reemplazó.`,
      );
    } catch {
      setAviso("");
      setError(
        "Ese archivo no es un respaldo de este sistema. Busca el que se llama respaldo-citas y termina en .json.",
      );
    } finally {
      entrada.value = "";
    }
  }

  function borrarTodo() {
    citas.forEach((c) => borrarCita(c.id));
    recargar();
    setPaso(0);
    setError("");
    setAviso("Listo, se borraron todas las citas de este navegador.");
  }

  return (
    <div className="space-y-8">
      <section
        aria-label="Dónde vive tu información"
        className="rounded-2xl border p-5 sm:p-6"
        style={{ borderColor: "var(--marca)" }}
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Léelo una vez y no lo olvides</h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-white/80">
          Tus citas viven <strong className="text-white">solo en este navegador</strong>, en esta
          computadora. No hay servidor ni base de datos. Si borras el historial, usas otra
          computadora o entras desde el celular, no vas a ver estas citas.
        </p>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-white/80">
          Por eso: <strong className="text-white">descarga tu respaldo cada semana</strong> y
          guárdalo donde no se te pierda. Es lo único que te protege.
        </p>
      </section>

      <section
        aria-label="Descargar tu información"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Llévate tu información</h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-white/70">
          Tienes {citas.length} {citas.length === 1 ? "cita guardada" : "citas guardadas"}.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Boton onClick={descargarRespaldo}>Descargar respaldo</Boton>
          <button
            type="button"
            onClick={descargarCsv}
            className="inline-flex min-h-[48px] items-center rounded-2xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          >
            Descargar mis citas (Excel)
          </button>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-white/55">
          El respaldo sirve para volver a cargar todo aquí. El de Excel sirve para verlo, filtrarlo
          o mandárselo a alguien.
        </p>
      </section>

      <section
        aria-label="Restaurar un respaldo"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Restaurar un respaldo</h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-white/70">
          Sube el archivo <strong className="text-white">respaldo-citas…json</strong> que
          descargaste antes. Ojo: reemplaza todo lo que tengas ahora en este navegador.
        </p>

        <label
          htmlFor="respaldo"
          className="mt-5 inline-flex min-h-[48px] cursor-pointer items-center rounded-2xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--acento)]"
        >
          Elegir el archivo del respaldo
          <input
            id="respaldo"
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              void restaurar(e.target);
            }}
            className="sr-only"
          />
        </label>
      </section>

      <section
        aria-label="Borrar todo"
        className="rounded-2xl border border-red-400/25 bg-red-500/[0.06] p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Borrar todo</h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-white/70">
          Borra las {citas.length} citas de este navegador. No se puede deshacer.
        </p>

        <div className="mt-5">
          {paso === 0 ? (
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="inline-flex min-h-[48px] items-center rounded-2xl border border-red-400/40 px-5 text-base font-medium text-red-200 transition hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            >
              Borrar todas mis citas
            </button>
          ) : null}

          {paso === 1 ? (
            <div>
              <p className="text-base text-white">
                Antes de borrar: ¿ya descargaste tu respaldo? Si no, hazlo primero.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPaso(2)}
                  className="inline-flex min-h-[48px] items-center rounded-2xl border border-red-400/40 px-5 text-base font-medium text-red-200 transition hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                >
                  Ya tengo mi respaldo, sigue
                </button>
                <button
                  type="button"
                  onClick={() => setPaso(0)}
                  className="inline-flex min-h-[48px] items-center rounded-2xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                >
                  Mejor no
                </button>
              </div>
            </div>
          ) : null}

          {paso === 2 ? (
            <div>
              <p className="text-base font-medium text-white">
                Última vez que te pregunto: esto borra las {citas.length} citas para siempre.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={borrarTodo}
                  className="inline-flex min-h-[48px] items-center rounded-2xl bg-red-500 px-5 text-base font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                >
                  Sí, borrar todo
                </button>
                <button
                  type="button"
                  onClick={() => setPaso(0)}
                  className="inline-flex min-h-[48px] items-center rounded-2xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <p aria-live="polite" className="min-h-[1.5rem] text-base font-medium text-white">
        {aviso}
      </p>
      {error ? (
        <p role="alert" className="text-base font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
