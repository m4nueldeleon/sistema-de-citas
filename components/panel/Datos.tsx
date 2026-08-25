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

  // El BOM (\uFEFF) le dice a Excel que el archivo trae acentos.
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

  function descargarRespaldo() {
    descargar(
      `respaldo-citas-${fecha}.json`,
      JSON.stringify(citas, null, 2),
      "application/json;charset=utf-8",
    );
    setError("");
    setAviso("Guarda ese archivo en tu correo o en la nube. Esa es tu copia de seguridad.");
  }

  function descargarCsv() {
    if (citas.length === 0) {
      setAviso("");
      setError("Todavía no tienes citas que descargar.");
      return;
    }
    descargar(`citas-${fecha}.csv`, aCsv(citas), "text/csv;charset=utf-8");
    setError("");
    setAviso("Descargué tus citas en un archivo que abre en Excel o en Google Sheets.");
  }

  async function restaurar(entrada: HTMLInputElement) {
    const elegido = entrada.files?.[0];
    if (!elegido) return;
    try {
      const crudo: unknown = JSON.parse(await elegido.text());
      if (!Array.isArray(crudo)) throw new Error("formato");
      const validas = crudo.filter(esCita).map(normalizar);
      if (validas.length === 0) throw new Error("vacío");

      leerCitas().forEach((c) => borrarCita(c.id));
      validas.forEach((c) => guardarCita(c));
      recargar();

      setError("");
      setAviso(
        `Restauré ${validas.length} ${validas.length === 1 ? "cita" : "citas"} del respaldo. Lo que había antes se reemplazó.`,
      );
    } catch {
      setAviso("");
      setError(
        "Ese archivo no es un respaldo de este sistema. Busca el que empieza con respaldo-citas y termina en .json.",
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
    <div className="space-y-6">
      <section aria-label="Dónde vive tu información" className="rounded-tarjeta border border-marca p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl">Léelo una vez y no se te olvide</h2>
        <p className="mt-3 max-w-prose text-tinta-suave">
          Tus citas viven <strong className="text-tinta">solo en este navegador</strong>, en esta
          computadora. No hay servidor ni base de datos. Si borras el historial, si usas otra
          computadora o si entras desde el celular, no vas a ver estas citas.
        </p>
        <p className="mt-3 max-w-prose text-tinta-suave">
          Por eso: <strong className="text-tinta">descarga tu respaldo cada semana</strong> y
          guárdalo donde no se te pierda. Es lo único que te protege.
        </p>
      </section>

      <section aria-label="Llevarte tu información" className="tarjeta p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl">Llévate tu información</h2>
        <p className="mt-2 max-w-prose text-tinta-suave">
          Ahorita tienes {citas.length} {citas.length === 1 ? "cita guardada" : "citas guardadas"}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Boton onClick={descargarRespaldo}>Descargar respaldo</Boton>
          <Boton variante="secundario" onClick={descargarCsv}>
            Descargar mis citas (Excel)
          </Boton>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-tinta-suave">
          El respaldo sirve para volver a cargar todo aquí. El de Excel sirve para verlo, filtrarlo
          o mandárselo a alguien.
        </p>
      </section>

      <section aria-label="Restaurar un respaldo" className="tarjeta p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl">Restaurar un respaldo</h2>
        <p className="mt-2 max-w-prose text-tinta-suave">
          Sube el archivo <strong className="text-tinta">respaldo-citas….json</strong> que
          descargaste antes. Ojo: reemplaza todo lo que tengas ahora en este navegador.
        </p>

        <label
          htmlFor="respaldo"
          className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-borde px-6 text-[1.0625rem] font-semibold text-tinta transition hover:border-marca focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-acento"
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
        className="rounded-tarjeta border border-red-400/30 bg-red-500/[0.07] p-5 sm:p-6"
      >
        <h2 className="text-xl sm:text-2xl">Borrar todo</h2>
        <p className="mt-2 max-w-prose text-tinta-suave">
          Borra las {citas.length} citas de este navegador. No se puede deshacer.
        </p>

        <div className="mt-6">
          {paso === 0 ? (
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-red-400/40 px-6 text-[1.0625rem] font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Borrar todas mis citas
            </button>
          ) : null}

          {paso === 1 ? (
            <div>
              <p className="text-tinta">
                Antes de borrar: ¿ya descargaste tu respaldo? Si no, hazlo primero.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPaso(2)}
                  className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-red-400/40 px-6 text-[1.0625rem] font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Ya tengo mi respaldo, sigue
                </button>
                <Boton variante="fantasma" onClick={() => setPaso(0)}>
                  Mejor no
                </Boton>
              </div>
            </div>
          ) : null}

          {paso === 2 ? (
            <div>
              <p className="font-medium text-tinta">
                Última vez que te pregunto: esto borra las {citas.length} citas para siempre.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={borrarTodo}
                  className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-red-500 px-6 text-[1.0625rem] font-semibold text-white transition hover:brightness-110"
                >
                  Sí, borrar todo
                </button>
                <Boton variante="fantasma" onClick={() => setPaso(0)}>
                  Cancelar
                </Boton>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <p aria-live="polite" className="font-medium text-tinta empty:hidden">
        {aviso}
      </p>
      {error ? (
        <p role="alert" className="font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
