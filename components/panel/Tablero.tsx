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
  const aguja = texto.trim().toLowerCase();
  if (!aguja) return true;
  return Object.values(cita.respuestas).some((valor) =>
    String(valor).toLowerCase().includes(aguja),
  );
}

export function Tablero({ citas, recargar }: { citas: Cita[]; recargar: () => void }) {
  const [busca, setBusca] = useState("");
  const [idAbierto, setIdAbierto] = useState<string | null>(null);

  const filtradas = useMemo(
    () => ordenarPorFecha(citas.filter((c) => coincide(c, busca))),
    [citas, busca],
  );

  const porEtapa = useMemo(() => {
    const mapa = new Map<string, Cita[]>(ETAPAS.map((e) => [e.id, []]));
    filtradas.forEach((cita) => {
      mapa.get(etapaDe(cita))?.push(cita);
    });
    return mapa;
  }, [filtradas]);

  const citaAbierta = citas.find((c) => c.id === idAbierto) ?? null;

  function moverA(cita: Cita, etapa: string) {
    guardarCita({ ...cita, etapa });
    recargar();
  }

  if (citas.length === 0) {
    return (
      <section className="tarjeta p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl">Tu tablero está vacío</h2>
        <p className="mt-3 max-w-prose text-tinta-suave">
          Aquí van a aparecer las personas que aparten cita. Si alguien ya te mandó su código por
          WhatsApp, ve a la pestaña <strong className="text-tinta">Agregar</strong> y pégalo: la
          cita entra completa, sin que teclees nada.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Tus citas por etapa">
      <label htmlFor="busca" className="etiqueta">
        Buscar
      </label>
      <input
        id="busca"
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Nombre, WhatsApp o correo"
        className="campo"
      />

      {busca.trim() !== "" ? (
        <p aria-live="polite" className="mt-3 text-tinta-suave">
          {filtradas.length === 0
            ? "Nadie coincide con lo que escribiste. Prueba con menos letras."
            : `${filtradas.length} ${filtradas.length === 1 ? "cita coincide" : "citas coinciden"}.`}
        </p>
      ) : null}

      <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        <div className="flex gap-3 md:flex-wrap">
          {ETAPAS.map((etapa) => {
            const lista = porEtapa.get(etapa.id) ?? [];
            return (
              <div
                key={etapa.id}
                className="tarjeta w-[78vw] shrink-0 p-3 sm:w-[320px] md:w-auto md:min-w-[250px] md:flex-1"
              >
                <div className="flex items-baseline justify-between gap-2 px-1">
                  <h3 className="text-base font-semibold text-tinta">{etapa.nombre}</h3>
                  <span className="tabular-nums text-tinta-suave">{lista.length}</span>
                </div>

                <ul className="mt-3 space-y-2">
                  {lista.map((cita) => (
                    <li key={cita.id} className="rounded-xl border border-borde bg-fondo/50 p-3">
                      <button
                        type="button"
                        onClick={() => setIdAbierto(cita.id)}
                        className="w-full cursor-pointer text-left"
                      >
                        <span className="block truncate font-medium text-tinta">
                          {cita.respuestas.nombre?.trim() || "Sin nombre"}
                        </span>
                        <span className="mt-0.5 block text-base text-tinta-suave">
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
                        className="campo mt-3 min-h-11 py-2 text-[0.95rem]"
                      >
                        {ETAPAS.map((op) => (
                          <option key={op.id} value={op.id}>
                            {op.nombre}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}

                  {lista.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-borde px-3 py-4 text-tinta-suave">
                      Nadie por aquí
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-[15px] text-tinta-suave">
        Toca una tarjeta para ver todo lo que contestó, apuntar notas o escribirle.
      </p>

      {citaAbierta ? (
        <Ficha cita={citaAbierta} alCerrar={() => setIdAbierto(null)} recargar={recargar} />
      ) : null}
    </section>
  );
}
