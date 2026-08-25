"use client";

import { useEffect, useRef, useState } from "react";
import Boton from "@/components/ui/Boton";
import { config } from "@/lib/negocio";

export function BarraFija() {
  const barra = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enPantalla = (e: Element | null | undefined) => {
      if (!e) return false;
      const c = e.getBoundingClientRect();
      return c.top < window.innerHeight * 0.85 && c.bottom > 0;
    };

    // La barra solo sirve en el tramo de en medio: estorba en la portada y sobra
    // cuando la persona ya tiene enfrente la agenda o alguno de los botones reales.
    const revisar = () => {
      const otrosBotones = Array.from(
        document.querySelectorAll('a[href="#agenda"]'),
      ).filter((a) => !barra.current?.contains(a));

      const yaLoTieneEnfrente =
        enPantalla(document.getElementById("agenda")) || otrosBotones.some(enPantalla);

      setVisible(window.scrollY > 420 && !yaLoTieneEnfrente);
    };

    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      window.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", revisar);
    };
  }, []);

  const { landing, oferta } = config;

  return (
    <>
      {/* Aire al final para que la barra no tape el pie de página */}
      <div aria-hidden className="h-24 sm:hidden" />

      <div
        ref={barra}
        aria-hidden={!visible}
        className={[
          "fixed inset-x-0 bottom-0 z-40 px-3 pt-3 sm:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "transition-transform duration-300",
          visible ? "translate-y-0" : "pointer-events-none translate-y-[130%]",
        ].join(" ")}
      >
        <div className="vidrio flex items-center gap-3 p-3 shadow-[0_-14px_40px_-18px_rgb(0_0_0/0.9)]">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-snug">{oferta.nombre}</p>
            <p className="truncate leading-snug text-tinta-suave">
              {oferta.duracionMinutos} min · {oferta.precioTexto}
            </p>
          </div>
          <Boton href="#agenda" tamano="md">
            {landing.ctaTexto}
          </Boton>
        </div>
      </div>
    </>
  );
}

export default BarraFija;
