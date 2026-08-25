"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Boton } from "@/components/ui/Boton";
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

/** Las etiquetas del formulario, más cualquier dato extra que venga en el código de cita. */
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
    `Hola ${cita.respuestas.nombre?.trim() ?? ""}, te escribo de ${config.negocio.nombre}.`,
  );
  const etapaActual = config.crm.etapas.some((e) => e.id === cita.etapa)
    ? cita.etapa
    : (config.crm.etapas[0]?.id ?? "");

  function guardarNota() {
    const texto = nota.trim();
    if (!texto) return;
    guardarCita({ ...cita, notas: [...cita.notas, { fecha: new Date().toISOString(), texto }] });
    setNota("");
    recargar();
  }

  function borrar() {
    borrarCita(cita.id);
    recargar();
    alCerrar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={alCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        className="tarjeta relative flex max-h-[88svh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:rounded-b-tarjeta"
      >
        <div className="flex items-start justify-between gap-4 border-b border-borde px-5 py-4">
          <div className="min-w-0">
            <h2 id="ficha-titulo" className="truncate text-xl">
              {nombre}
            </h2>
            <p className="mt-0.5 text-tinta-suave">{textoLargo(cita.inicio)}</p>
          </div>
          <button
            ref={botonCerrar}
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar la ficha"
            className="-mr-1 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-borde text-xl text-tinta-suave transition hover:border-marca hover:text-tinta"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <label htmlFor="ficha-etapa" className="etiqueta">
            ¿En qué va?
          </label>
          <select
            id="ficha-etapa"
            value={etapaActual}
            onChange={(e) => {
              guardarCita({ ...cita, etapa: e.target.value });
              recargar();
            }}
            className="campo"
          >
            {config.crm.etapas.map((etapa) => (
              <option key={etapa.id} value={etapa.id}>
                {etapa.nombre}
              </option>
            ))}
          </select>

          <h3 className="mt-8 text-lg">Lo que contestó</h3>
          {datos.length > 0 ? (
            <dl className="mt-3 space-y-2">
              {datos.map((fila, i) => (
                <div
                  key={`${fila.etiqueta}-${i}`}
                  className="rounded-xl border border-borde bg-fondo/50 p-3"
                >
                  <dt className="text-[0.8125rem] uppercase tracking-wide text-tinta-suave">
                    {fila.etiqueta}
                  </dt>
                  <dd className="mt-1 break-words whitespace-pre-wrap text-tinta">{fila.valor}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-tinta-suave">No llegó ningún dato con esta cita.</p>
          )}

          <p className="mt-4 text-[15px] leading-relaxed text-tinta-suave">
            Dura {cita.duracionMinutos} minutos · Llegó por {cita.origen} · Se apartó el{" "}
            {textoMomento(cita.creada)}
          </p>

          <h3 className="mt-8 text-lg">Notas</h3>
          {cita.notas.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {cita.notas
                .slice()
                .reverse()
                .map((n, i) => (
                  <li
                    key={`${n.fecha}-${i}`}
                    className="rounded-xl border border-borde bg-fondo/50 p-3"
                  >
                    <p className="text-[0.8125rem] text-tinta-suave">{textoMomento(n.fecha)}</p>
                    <p className="mt-1 break-words whitespace-pre-wrap text-tinta">{n.texto}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-2 text-tinta-suave">
              Todavía no hay notas. Apunta aquí lo que se dijo, para que tu seguimiento no dependa
              de tu memoria.
            </p>
          )}

          <label htmlFor="ficha-nota" className="etiqueta mt-5">
            Agregar nota
          </label>
          <textarea
            id="ficha-nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            placeholder="Quedó de mandarme sus números el jueves."
            className="campo"
          />
          <div className="mt-3">
            <Boton variante="secundario" onClick={guardarNota} deshabilitado={nota.trim() === ""}>
              Guardar nota
            </Boton>
          </div>

          <div className="mt-8 border-t border-borde pt-5">
            {confirmando ? (
              <div className="rounded-xl border border-red-400/35 bg-red-500/10 p-4">
                <p className="text-tinta">
                  ¿Borro esta cita? No se puede deshacer y no queda copia en ningún lado.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={borrar}
                    className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-red-500 px-6 text-[1.0625rem] font-semibold text-white transition hover:brightness-110"
                  >
                    Sí, borrar
                  </button>
                  <Boton variante="fantasma" onClick={() => setConfirmando(false)}>
                    Cancelar
                  </Boton>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-red-400/35 px-6 text-[1.0625rem] font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                Borrar cita
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-borde px-5 py-4">
          {whatsapp ? (
            <Boton href={whatsapp} nuevaPestana tamano="lg" anchoCompleto>
              Escribirle por WhatsApp
            </Boton>
          ) : (
            <p className="text-tinta-suave">
              Esta cita no trae WhatsApp, así que no puedo abrirte el chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
