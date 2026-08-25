"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { config } from "@/lib/negocio";
import { textoLargo } from "@/lib/fechas";
import { borrarCita, guardarCita } from "@/lib/almacen";
import { ligaSeguimiento } from "@/lib/whatsapp";
import type { Cita } from "@/lib/tipos";

function textoMomento(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const fecha = d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const hora = d.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
  return `${fecha}, ${hora}`;
}

/** Etiquetas del formulario + cualquier respuesta extra que llegue por código de cita. */
function filas(cita: Cita): { etiqueta: string; valor: string }[] {
  const campos = config.formulario.campos;
  const conocidas = campos
    .map((campo) => ({ etiqueta: campo.etiqueta, valor: (cita.respuestas[campo.id] ?? "").trim() }))
    .filter((f) => f.valor !== "");
  const ids = new Set(campos.map((c) => c.id));
  const extras = Object.entries(cita.respuestas)
    .filter(([id, valor]) => !ids.has(id) && String(valor).trim() !== "")
    .map(([id, valor]) => ({ etiqueta: id, valor: String(valor).trim() }));
  return [...conocidas, ...extras];
}

export function Ficha({
  cita,
  alCerrar,
  recargar,
}: {
  cita: Cita;
  alCerrar: () => void;
  recargar: () => void;
}) {
  const [nota, setNota] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const botonCerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    botonCerrar.current?.focus();
    function alTeclear(evento: KeyboardEvent) {
      if (evento.key === "Escape") alCerrar();
    }
    document.addEventListener("keydown", alTeclear);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [alCerrar]);

  const datos = useMemo(() => filas(cita), [cita]);
  const nombre = cita.respuestas.nombre?.trim() || "Sin nombre";
  const whatsapp = ligaSeguimiento(
    cita,
    `Hola ${cita.respuestas.nombre ?? ""}, te escribo de ${config.negocio.nombre}.`,
  );

  function guardarNota() {
    const texto = nota.trim();
    if (!texto) return;
    guardarCita({
      ...cita,
      notas: [...cita.notas, { fecha: new Date().toISOString(), texto }],
    });
    setNota("");
    recargar();
  }

  function cambiarEtapa(id: string) {
    guardarCita({ ...cita, etapa: id });
    recargar();
  }

  function borrar() {
    borrarCita(cita.id);
    recargar();
    alCerrar();
  }

  const etapaActual = config.crm.etapas.some((e) => e.id === cita.etapa)
    ? cita.etapa
    : (config.crm.etapas[0]?.id ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={alCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        className="relative flex max-h-[88svh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#14110d] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2 id="ficha-titulo" className="truncate text-xl font-semibold text-white">
              {nombre}
            </h2>
            <p className="mt-0.5 text-base text-white/65">{textoLargo(cita.inicio)}</p>
          </div>
          <button
            ref={botonCerrar}
            type="button"
            onClick={alCerrar}
            className="-mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 text-xl text-white/80 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            aria-label="Cerrar la ficha"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <label htmlFor="ficha-etapa" className="block text-base font-medium text-white">
            ¿En qué va?
          </label>
          <select
            id="ficha-etapa"
            value={etapaActual}
            onChange={(e) => cambiarEtapa(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          >
            {config.crm.etapas.map((etapa) => (
              <option key={etapa.id} value={etapa.id} className="bg-[#14110d]">
                {etapa.nombre}
              </option>
            ))}
          </select>

          <h3 className="mt-7 text-lg font-semibold text-white">Lo que contestó</h3>
          <dl className="mt-3 space-y-3">
            {datos.map((fila, i) => (
              <div
                key={`${fila.etiqueta}-${i}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <dt className="text-sm uppercase tracking-wide text-white/50">{fila.etiqueta}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-base text-white">
                  {fila.valor}
                </dd>
              </div>
            ))}
            {datos.length === 0 ? (
              <p className="text-base text-white/60">No llegó ningún dato con esta cita.</p>
            ) : null}
          </dl>

          <p className="mt-4 text-[15px] leading-relaxed text-white/50">
            Duración: {cita.duracionMinutos} minutos · Llegó por: {cita.origen} · Se apartó el{" "}
            {textoMomento(cita.creada)}
          </p>

          <h3 className="mt-7 text-lg font-semibold text-white">Notas</h3>
          {cita.notas.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {[...cita.notas]
                .slice()
                .reverse()
                .map((n, i) => (
                  <li
                    key={`${n.fecha}-${i}`}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <p className="text-sm text-white/50">{textoMomento(n.fecha)}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-base text-white">
                      {n.texto}
                    </p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-2 text-base text-white/60">
              Todavía no hay notas. Apunta aquí lo que se dijo para que no dependa de tu memoria.
            </p>
          )}

          <label htmlFor="ficha-nota" className="mt-4 block text-base font-medium text-white">
            Agregar nota
          </label>
          <textarea
            id="ficha-nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            placeholder="Quedó de mandar sus números el jueves."
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-3 text-base text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          />
          <button
            type="button"
            onClick={guardarNota}
            disabled={nota.trim() === ""}
            className="mt-2 inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          >
            Guardar nota
          </button>

          <div className="mt-8 border-t border-white/10 pt-5">
            {confirmando ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4">
                <p className="text-base text-white">
                  ¿Borro esta cita? No se puede deshacer y no queda copia en ningún lado.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={borrar}
                    className="inline-flex min-h-[44px] items-center rounded-xl bg-red-500 px-5 text-base font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                  >
                    Sí, borrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(false)}
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="inline-flex min-h-[44px] items-center rounded-xl border border-red-400/30 px-5 text-base font-medium text-red-300 transition hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
              >
                Borrar cita
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl px-5 text-lg font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
              style={{ backgroundColor: "var(--marca)" }}
            >
              Escribirle por WhatsApp
            </a>
          ) : (
            <p className="text-base text-white/60">
              Esta cita no trae WhatsApp, así que no puedo abrirte el chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
