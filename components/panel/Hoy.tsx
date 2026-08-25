"use client";

import { useState } from "react";
import { config } from "@/lib/negocio";
import { esHoy, ordenarPorFecha, textoHora } from "@/lib/fechas";
import { ligaSeguimiento, textoRecordatorio } from "@/lib/whatsapp";
import type { Cita } from "@/lib/tipos";

function soloDigitos(numero: string): string {
  return numero.replace(/\D/g, "");
}

function nombreEtapa(id: string): string {
  return config.crm.etapas.find((e) => e.id === id)?.nombre ?? "Nueva";
}

export function Hoy({ citas }: { citas: Cita[] }) {
  const deHoy = ordenarPorFecha(citas.filter((c) => esHoy(c.inicio)));

  if (deHoy.length === 0) return <SinCitas />;

  return (
    <section aria-label="Tu agenda de hoy">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">
        {deHoy.length === 1 ? "Tienes 1 cita hoy" : `Tienes ${deHoy.length} citas hoy`}
      </h2>

      <ul className="mt-4 space-y-3">
        {deHoy.map((cita) => {
          const nombre = cita.respuestas.nombre?.trim() || "Sin nombre";
          const numero = soloDigitos(cita.respuestas.whatsapp ?? "");
          const recordatorio = ligaSeguimiento(cita, textoRecordatorio(cita));

          return (
            <li
              key={cita.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p
                  className="text-2xl font-semibold tabular-nums"
                  style={{ color: "var(--marca)" }}
                >
                  {textoHora(cita.inicio)}
                </p>
                <p className="text-lg font-medium text-white">{nombre}</p>
              </div>

              <p className="mt-1 text-base text-white/60">
                {cita.duracionMinutos} minutos · {nombreEtapa(cita.etapa)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {numero ? (
                  <a
                    href={`https://wa.me/${numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-4 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                  >
                    {cita.respuestas.whatsapp}
                  </a>
                ) : (
                  <span className="inline-flex min-h-[44px] items-center text-base text-white/50">
                    No dejó WhatsApp
                  </span>
                )}

                {recordatorio ? (
                  <a
                    href={recordatorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-xl px-5 text-base font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
                    style={{ backgroundColor: "var(--marca)" }}
                  >
                    Mandar recordatorio
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SinCitas() {
  const [copiado, setCopiado] = useState(false);

  async function copiarLiga() {
    const liga = window.location.origin + "/";
    try {
      await navigator.clipboard.writeText(liga);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copia tu liga y pégala donde te escriben:", liga);
    }
  }

  return (
    <section
      aria-label="Tu agenda de hoy"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 className="text-xl font-semibold text-white sm:text-2xl">Hoy tienes el día libre</h2>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-white/70">
        Las citas no llegan solas: llegan cuando la gente ve tu liga. Pégala en tu perfil de
        Instagram, en tu firma de correo y en el chat cuando alguien pregunte por{" "}
        {config.oferta.nombre.toLowerCase()}.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiarLiga}
          className="inline-flex min-h-[48px] items-center rounded-xl px-5 text-base font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
          style={{ backgroundColor: "var(--marca)" }}
        >
          {copiado ? "Liga copiada" : "Copiar mi liga"}
        </button>
        <a
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-xl border border-white/15 px-5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
        >
          Ver cómo se ve
        </a>
      </div>

      <p aria-live="polite" className="sr-only">
        {copiado ? "Liga copiada" : ""}
      </p>
    </section>
  );
}
