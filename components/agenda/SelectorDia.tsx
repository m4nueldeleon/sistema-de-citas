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

const BASE =
  "flex min-h-[5.75rem] min-w-[8.75rem] shrink-0 snap-start flex-col justify-center rounded-2xl " +
  "border px-4 py-3 text-left transition duration-150 active:translate-y-px";

const APAGADO = "border-borde bg-superficie hover:border-marca";
const ENCENDIDO =
  "border-marca bg-[color-mix(in_oklab,var(--marca)_14%,transparent)]";

/** "Hoy" y "Mañana" se leen mejor que una fecha para quien agenda de prisa. */
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
        className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3"
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
              className={`${BASE} ${activo ? ENCENDIDO : APAGADO}`}
            >
              <span
                className={`text-sm font-semibold uppercase tracking-widest ${
                  relativa ? "text-marca" : "text-tinta-suave"
                }`}
              >
                {relativa ?? "Libre"}
              </span>
              <span className="mt-1 text-lg font-semibold capitalize text-tinta">
                {textoCorto(dia.horarios[0])}
              </span>
              <span className="mt-0.5 text-sm text-tinta-suave">
                {cuantos} {cuantos === 1 ? "horario" : "horarios"}
              </span>
            </button>
          );
        })}
      </div>

      {dias.length > 2 ? (
        <p className="text-sm text-tinta-suave">Desliza de lado para ver más días.</p>
      ) : null}
    </div>
  );
}

export default SelectorDia;
