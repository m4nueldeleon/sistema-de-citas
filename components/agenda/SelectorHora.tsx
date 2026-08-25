"use client";

import { textoHora } from "@/lib/fechas";

type Props = {
  horarios: string[];
  activo: string | null;
  alElegir: (inicio: string) => void;
};

const BOTON_HORA =
  "flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-[17px] font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const ESTILO_ACTIVO = {
  borderColor: "var(--marca)",
  backgroundColor: "color-mix(in srgb, var(--marca) 18%, transparent)",
};

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
            className={BOTON_HORA}
            style={elegido ? ESTILO_ACTIVO : undefined}
          >
            {textoHora(inicio)}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorHora;
