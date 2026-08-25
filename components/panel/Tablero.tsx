"use client";

import { useMemo, useState } from "react";
import { config } from "@/lib/negocio";
import { ordenarPorFecha, textoCorto, textoHora } from "@/lib/fechas";
import { guardarCita } from "@/lib/almacen";
import type { Cita, Etapa } from "@/lib/tipos";
import { Ficha } from "./Ficha";

const ETAPAS: Etapa[] = config.crm.etapas;
const IDS = new Set(ETAPAS.map((e) => e.id));

/** Si la cita trae una etapa que ya no existe en la configuración, cae en la primera columna. */
function etapaDe(cita: Cita): string {
  return IDS.has(cita.etapa) ? cita.etapa : (ETAPAS[0]?.id ?? "");
}

function coincide(cita: Cita, texto: string): boolean {
  if (!texto) return true;
  const aguja = texto.trim().toLowerCase();
  return Object.values(cita.respuestas).some((valor) =>
    String(valor).toLowerCase().includes(aguja),
  );
}

export function Tablero({ citas, recargar }: { citas: Cita[]; recargar: () => void }) {
  const [busca, setBusca] = useState("");
  const [idAbierto, setIdAbierto] = useState<string | null>(null);

  const porEtapa = useMemo(() => {
    const filtradas = ordenarPorFecha(citas.filter((c) => coincide(c, busca)));
    const mapa = new Map<string, Cita[]>(ETAPAS.map((e) => [e.id, []]));
    filtradas.forEach((cita) => {
      mapa.get(etapaDe(cita))?.push(cita);
    });
    return mapa;
  }, [citas, busca]);

  const encontradas = useMemo(
    () => citas.filter((c) => coincide(c, busca)).length,
    [citas, busca],
  );

  const citaAbierta = citas.find((c) => c.id === idAbierto) ?? null;

  function moverA(cita: Cita, etapa: string) {
    guardarCita({ ...cita, etapa });
    recargar();
  }

  if (citas.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Tu tablero está vacío</h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-white/70">
          Aquí van a aparecer las personas que aparten cita. Si alguien ya te mandó su código por
          WhatsApp, ve a la pestaña <strong className="text-white">Agregar</strong> y pégalo: la
          cita entra completa, sin que teclees nada.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Tus citas por etapa">
      <label htmlFor="busca" className="block text-base font-medium text-white">
        Buscar
      </label>
      <input
        id="busca"
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Nombre, WhatsApp o correo"
        className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
      />

      {busca.trim() !== "" ? (
        <p aria-live="polite" className="mt-3 text-base text-white/65">
          {encontradas === 0
            ? "Nadie coincide con lo que escribiste. Prueba con menos letras."
            : `${encontradas} ${encontradas === 1 ? "cita coincide" : "citas coinciden"}.`}
        </p>
      ) : null}

      <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex gap-3 md:flex-wrap">
          {ETAPAS.map((etapa) => {
            const lista = porEtapa.get(etapa.id) ?? [];
            return (
              <div
                key={etapa.id}
                className="w-[80vw] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:w-[320px] md:w-auto md:min-w-[260px] md:flex-1"
              >
                <div className="flex items-baseline justify-between gap-2 px-1">
                  <h3 className="text-base font-semibold text-white">{etapa.nombre}</h3>
                  <span className="text-base tabular-nums text-white/50">{lista.length}</span>
                </div>

                <ul className="mt-3 space-y-2">
                  {lista.map((cita) => (
                    <li
                      key={cita.id}
                      className="rounded-xl border border-white/10 bg-white/[0.05] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => setIdAbierto(cita.id)}
                        className="w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                      >
                        <span className="block truncate text-base font-medium text-white">
                          {cita.respuestas.nombre?.trim() || "Sin nombre"}
                        </span>
                        <span className="mt-0.5 block text-base text-white/60">
                          {textoCorto(cita.inicio)} · {textoHora(cita.inicio)}
                        </span>
                      </button>

                      <label htmlFor={`etapa-${cita.id}`} className="sr-only">
                        Cambiar la etapa de {cita.respuestas.nombre?.trim() || "esta cita"}
                      </label>
                      <select
                        id={`etapa-${cita.id}`}
                        value={etapaDe(cita)}
                        onChange={(e) => moverA(cita, e.target.value)}
                        className="mt-3 h-11 w-full rounded-lg border border-white/15 bg-black/40 px-2 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                      >
                        {ETAPAS.map((op) => (
                          <option key={op.id} value={op.id} className="bg-[#14110d]">
                            {op.nombre}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}

                  {lista.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-base text-white/40">
                      Nadie por aquí
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[15px] text-white/50">
        Toca una tarjeta para ver todo lo que contestó, agregar notas o escribirle.
      </p>

      {citaAbierta ? (
        <Ficha cita={citaAbierta} alCerrar={() => setIdAbierto(null)} recargar={recargar} />
      ) : null}
    </section>
  );
}
