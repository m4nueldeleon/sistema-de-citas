"use client";

import { aClave, textoCorto } from "@/lib/fechas";

/** Un día con al menos un horario libre. Coincide con lo que devuelve diasDisponibles(). */
export type DiaDisponible = {
  clave: string;
  fecha: Date;
  horarios: string[];
};

type Props = {
  dias: DiaDisponible[];
  claveActiva: string | null;
  alElegir: (dia: DiaDisponible) => void;
};

const TARJETA_DIA =
  "flex min-h-[5.75rem] min-w-[8.75rem] shrink-0 snap-start flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const ESTILO_ACTIVO = {
  borderColor: "var(--marca)",
  backgroundColor: "color-mix(in srgb, var(--marca) 16%, transparent)",
};

/** "Hoy" y "Mañana" se leen mejor que una fecha para alguien que agenda de prisa. */
function etiquetaRelativa(clave: string): string | null {
  const hoy = new Date();
  if (clave === aClave(hoy)) return "Hoy";
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  if (clave === aClave(manana)) return "Mañana";
  return null;
}

export function SelectorDia({ dias, claveActiva, alElegir }: Props) {
  return (
    <div>
      <div
        role="group"
        aria-label="Días disponibles"
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3"
      >
        {dias.map((dia) => {
          const activo = dia.clave === claveActiva;
          const relativa = etiquetaRelativa(dia.clave);
          const cuantos = dia.horarios.length;
          return (
            <button
              key={dia.clave}
              type="button"
              aria-pressed={activo}
              onClick={() => alElegir(dia)}
              className={TARJETA_DIA}
              style={activo ? ESTILO_ACTIVO : undefined}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: relativa ? "var(--marca)" : "rgba(255,255,255,0.45)" }}
              >
                {relativa ?? "Disponible"}
              </span>
              <span className="mt-1 text-lg font-bold capitalize text-white">
                {textoCorto(dia.horarios[0])}
              </span>
              <span className="mt-0.5 text-sm text-white/60">
                {cuantos} {cuantos === 1 ? "horario" : "horarios"}
              </span>
            </button>
          );
        })}
      </div>
      {dias.length > 3 ? (
        <p className="text-sm text-white/45">Desliza de lado para ver más días.</p>
      ) : null}
    </div>
  );
}

export default SelectorDia;
