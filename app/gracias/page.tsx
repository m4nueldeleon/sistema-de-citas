import { Suspense } from "react";
import type { Metadata } from "next";

import { Confirmacion } from "@/components/gracias/Confirmacion";
import { Seccion } from "@/components/ui/Seccion";
import { config } from "@/lib/negocio";

export const metadata: Metadata = {
  title: `${config.gracias.titulo} · ${config.negocio.nombre}`,
  description: "Confirma tu cita por WhatsApp y agrégala a tu calendario.",
  robots: { index: false, follow: false },
};

function Cargando() {
  return (
    <div className="mx-auto w-full max-w-2xl" aria-hidden="true">
      <div className="h-6 w-40 animate-pulse rounded-full bg-white/[0.07]" />
      <div className="mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-white/[0.07]" />
      <div className="mt-6 h-32 animate-pulse rounded-3xl bg-white/[0.05]" />
    </div>
  );
}

export default function PaginaGracias() {
  return (
    <Seccion id="gracias">
      {/* La cita vive en el navegador y se lee con ?id=, así que necesita este límite. */}
      <Suspense fallback={<Cargando />}>
        <Confirmacion />
      </Suspense>
    </Seccion>
  );
}
