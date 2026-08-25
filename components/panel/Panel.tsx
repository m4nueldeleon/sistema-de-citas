"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Marca } from "@/components/ui/Marca";
import { config } from "@/lib/negocio";
import { aClave, esHoy, ordenarPorFecha } from "@/lib/fechas";
import { abrirPanel, cerrarPanel, leerCitas, panelAbierto, suscribir } from "@/lib/almacen";
import type { Cita } from "@/lib/tipos";
import { Entrada } from "./Entrada";
import { Hoy } from "./Hoy";
import { Tablero } from "./Tablero";
import { Pegar } from "./Pegar";
import { Datos } from "./Datos";

type Pestana = "hoy" | "citas" | "agregar" | "datos";

const PESTANAS: { id: Pestana; nombre: string }[] = [
  { id: "hoy", nombre: "Hoy" },
  { id: "citas", nombre: "Citas" },
  { id: "agregar", nombre: "Agregar" },
  { id: "datos", nombre: "Datos" },
];

/** La etapa que representa una venta cerrada, sin importar cómo la haya nombrado el negocio. */
function etapaDeVenta() {
  const etapas = config.crm.etapas;
  return (
    etapas.find((e) => e.id === "ganado") ??
    etapas.find((e) => /compr|gan|vend|cerr/i.test(e.nombre)) ??
    null
  );
}

export function Panel() {
  const [listo, setListo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pestana, setPestana] = useState<Pestana>("hoy");

  const recargar = useCallback(() => {
    setCitas(ordenarPorFecha(leerCitas()));
  }, []);

  useEffect(() => {
    setAbierto(panelAbierto());
    recargar();
    setListo(true);
    return suscribir(recargar);
  }, [recargar]);

  const venta = useMemo(etapaDeVenta, []);

  const numeros = useMemo(() => {
    const ahora = new Date();
    const desde = aClave(ahora);
    const hasta = aClave(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 7));
    const dia = (c: Cita) => c.inicio.slice(0, 10);
    return {
      hoy: citas.filter((c) => esHoy(c.inicio)).length,
      semana: citas.filter((c) => dia(c) >= desde && dia(c) < hasta).length,
      venta: venta ? citas.filter((c) => c.etapa === venta.id).length : citas.length,
    };
  }, [citas, venta]);

  if (!listo) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-5">
        <p className="text-base text-white/50">Abriendo tu panel…</p>
      </main>
    );
  }

  if (!abierto) {
    return (
      <Entrada
        alEntrar={() => {
          abrirPanel();
          setAbierto(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-[100svh] pb-20">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Marca />
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden min-h-[44px] items-center rounded-xl px-3 text-base text-white/65 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] sm:inline-flex"
            >
              Ver mi página
            </a>
            <button
              type="button"
              onClick={() => {
                cerrarPanel();
                setAbierto(false);
              }}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-4 text-base font-medium text-white/85 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Hola. Esto es lo que traes.
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <Numero titulo="Citas de hoy" valor={numeros.hoy} destacado />
          <Numero titulo="En los próximos 7 días" valor={numeros.semana} />
          <Numero
            titulo={venta ? venta.nombre : "Citas en total"}
            valor={numeros.venta}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <nav aria-label="Secciones del panel" className="mt-7">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:w-full">
              {PESTANAS.map((p) => {
                const activa = p.id === pestana;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-current={activa ? "page" : undefined}
                    onClick={() => setPestana(p.id)}
                    className={
                      "min-h-[44px] flex-1 whitespace-nowrap rounded-xl px-5 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] " +
                      (activa ? "text-black" : "text-white/70 hover:bg-white/10 hover:text-white")
                    }
                    style={activa ? { backgroundColor: "var(--marca)" } : undefined}
                  >
                    {p.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="aparecer mt-6" key={pestana}>
          {pestana === "hoy" ? <Hoy citas={citas} /> : null}
          {pestana === "citas" ? <Tablero citas={citas} recargar={recargar} /> : null}
          {pestana === "agregar" ? <Pegar recargar={recargar} /> : null}
          {pestana === "datos" ? <Datos citas={citas} recargar={recargar} /> : null}
        </div>
      </main>
    </div>
  );
}

function Numero({
  titulo,
  valor,
  destacado,
  className,
}: {
  titulo: string;
  valor: number;
  destacado?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 " + (className ?? "")
      }
    >
      <p
        className="text-4xl font-semibold tabular-nums text-white sm:text-5xl"
        style={{ color: destacado ? "var(--marca)" : undefined }}
      >
        {valor}
      </p>
      <p className="mt-1 text-base leading-snug text-white/65">{titulo}</p>
    </div>
  );
}
