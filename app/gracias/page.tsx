import { Suspense } from "react";
import type { Metadata } from "next";

import Confirmacion from "@/components/gracias/Confirmacion";
import Seccion from "@/components/ui/Seccion";
import { config } from "@/lib/negocio";

export const metadata: Metadata = {
  title: `${config.gracias.titulo} · ${config.negocio.nombre}`,
  description: "Confirma tu cita por WhatsApp y agrégala a tu calendario.",
  robots: { index: false, follow: false },
};

function Cargando() {
  return (
    <div className="mx-auto w-full max-w-2xl" aria-hidden="true">
      <div className="h-5 w-40 animate-pulse rounded-full bg-superficie" />
      <div className="mt-4 h-12 w-3/4 animate-pulse rounded-2xl bg-superficie" />
      <div className="mt-6 h-32 animate-pulse rounded-2xl bg-superficie" />
    </div>
  );
}

export default function PaginaGracias() {
  return (
    <main>
      <Seccion id="gracias" ancho="angosto">
        {/* La cita se lee del navegador con ?id=, y eso pide este límite de espera. */}
        <Suspense fallback={<Cargando />}>
          <Confirmacion />
        </Suspense>
      </Seccion>
    </main>
  );
}
