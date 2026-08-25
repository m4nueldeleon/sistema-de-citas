"use client";

import { textoHora } from "@/lib/fechas";

type Props = {
  horarios: string[];
  activo: string | null;
  alElegir: (inicio: string) => void;
};

const BASE =
  "flex min-h-[3.5rem] items-center justify-center rounded-2xl border px-3 " +
  "text-[1.0625rem] font-semibold transition duration-150 active:translate-y-px";

const APAGADO = "border-borde bg-superficie text-tinta hover:border-marca";
const ENCENDIDO =
  "border-marca bg-[color-mix(in_oklab,var(--marca)_16%,transparent)] text-tinta";

export function SelectorHora({ horarios, activo, alElegir }: Props) {
  return (
    <div
      role="group"
      aria-label="Horarios disponibles"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {horarios.map((inicio) => {
        const elegido = inicio === activo;
        return (
          <button
            key={inicio}
            type="button"
            aria-pressed={elegido}
            onClick={() => alElegir(inicio)}
            className={`${BASE} ${elegido ? ENCENDIDO : APAGADO}`}
          >
            {textoHora(inicio)}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorHora;
