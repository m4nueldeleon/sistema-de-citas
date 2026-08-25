"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Boton } from "@/components/ui/Boton";
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

/** La etapa que significa "ya me compró", sin importar cómo la haya nombrado el negocio. */
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
        <p className="text-tinta-suave">Abriendo tu panel…</p>
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
    <div className="min-h-[100svh] pb-24">
      <header className="sticky top-0 z-30 border-b border-borde bg-fondo/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Marca tamano="sm" />
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline-flex">
              <Boton href="/" variante="fantasma">
                Ver mi página
              </Boton>
            </span>
            <Boton
              variante="secundario"
              onClick={() => {
                cerrarPanel();
                setAbierto(false);
              }}
            >
              Salir
            </Boton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-9">
        <h1 className="text-2xl sm:text-3xl">Esto es lo que traes</h1>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <Numero titulo="Citas de hoy" valor={numeros.hoy} destacado />
          <Numero titulo="En los próximos 7 días" valor={numeros.semana} />
          <Numero
            titulo={venta ? venta.nombre : "Citas en total"}
            valor={numeros.venta}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <nav aria-label="Secciones del panel" className="mt-8">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-1 rounded-full border border-borde bg-superficie p-1.5 sm:w-full">
              {PESTANAS.map((p) => {
                const activa = p.id === pestana;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-current={activa ? "page" : undefined}
                    onClick={() => setPestana(p.id)}
                    className={
                      "min-h-11 flex-1 cursor-pointer whitespace-nowrap rounded-full px-6 text-[1.0625rem] font-semibold transition " +
                      (activa
                        ? "bg-marca text-sobre-marca"
                        : "text-tinta-suave hover:bg-borde hover:text-tinta")
                    }
                  >
                    {p.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div key={pestana} className="aparecer mt-7">
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
    <div className={["tarjeta px-4 py-4 sm:px-5", className ?? ""].join(" ")}>
      <p
        className={
          "font-display text-4xl font-semibold tabular-nums sm:text-5xl " +
          (destacado ? "text-marca" : "text-tinta")
        }
      >
        {valor}
      </p>
      <p className="mt-1 text-base leading-snug text-tinta-suave">{titulo}</p>
    </div>
  );
}
