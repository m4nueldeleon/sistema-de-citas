"use client";

import { useState } from "react";
import { Boton } from "@/components/ui/Boton";
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
      <h2 className="text-xl sm:text-2xl">
        {deHoy.length === 1 ? "Tienes 1 cita hoy" : `Tienes ${deHoy.length} citas hoy`}
      </h2>

      <ul className="mt-4 space-y-3">
        {deHoy.map((cita) => {
          const nombre = cita.respuestas.nombre?.trim() || "Sin nombre";
          const numero = soloDigitos(cita.respuestas.whatsapp ?? "");
          const recordatorio = ligaSeguimiento(cita, textoRecordatorio(cita));

          return (
            <li key={cita.id} className="tarjeta p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-display text-2xl font-semibold tabular-nums text-marca">
                  {textoHora(cita.inicio)}
                </p>
                <p className="text-lg font-medium text-tinta">{nombre}</p>
              </div>

              <p className="mt-1 text-tinta-suave">
                {cita.duracionMinutos} minutos · {nombreEtapa(cita.etapa)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {numero ? (
                  <Boton
                    variante="secundario"
                    href={`https://wa.me/${numero}`}
                    nuevaPestana
                    etiquetaAccesible={`Abrir el chat de WhatsApp con ${nombre}`}
                  >
                    {cita.respuestas.whatsapp}
                  </Boton>
                ) : (
                  <span className="inline-flex min-h-12 items-center text-tinta-suave">
                    No dejó WhatsApp
                  </span>
                )}

                {recordatorio ? (
                  <Boton href={recordatorio} nuevaPestana>
                    Mandar recordatorio
                  </Boton>
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
    <section aria-label="Tu agenda de hoy" className="tarjeta p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl">Hoy tienes el día libre</h2>
      <p className="mt-3 max-w-prose text-tinta-suave">
        Las citas no llegan solas: llegan cuando la gente ve tu liga. Pégala en tu perfil de
        Instagram, en tu firma de correo y en el chat cuando alguien pregunte por{" "}
        {config.oferta.nombre.toLowerCase()}.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Boton onClick={copiarLiga}>{copiado ? "Liga copiada" : "Copiar mi liga"}</Boton>
        <Boton variante="secundario" href="/">
          Ver cómo se ve
        </Boton>
      </div>

      <p aria-live="polite" className="sr-only">
        {copiado ? "Liga copiada" : ""}
      </p>
    </section>
  );
}
