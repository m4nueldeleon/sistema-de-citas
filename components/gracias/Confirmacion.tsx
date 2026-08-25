"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Boton } from "@/components/ui/Boton";
import { buscarCita } from "@/lib/almacen";
import { descargarIcs, ligaGoogleCalendar } from "@/lib/calendario";
import { codificarCita } from "@/lib/codigo";
import { textoLargo } from "@/lib/fechas";
import { config } from "@/lib/negocio";
import type { Cita } from "@/lib/tipos";
import { ligaConfirmacion } from "@/lib/whatsapp";

const VERDE = "#25D366";
const TINTA_SOBRE_VERDE = "#08210F";

const CAJA = "tarjeta rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7";
const ACCION =
  "flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-center text-base font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function whatsappDelNegocio(mensaje: string): string {
  const numero = config.negocio.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function Esqueleto() {
  return (
    <div className="mx-auto w-full max-w-2xl" aria-hidden="true">
      <div className="h-6 w-40 animate-pulse rounded-full bg-white/[0.07]" />
      <div className="mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-white/[0.07]" />
      <div className="mt-6 h-32 animate-pulse rounded-3xl bg-white/[0.05]" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-white/[0.05]" />
    </div>
  );
}

function NoEncontrada() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        Aquí no aparece tu cita
      </h1>
      <div className={`${CAJA} mt-6`}>
        <p className="text-lg leading-relaxed text-white/80">
          Tu cita se guarda en el teléfono o la computadora donde la apartaste. Si abriste esta
          página en otro aparato, en otro navegador, o si borraste los datos, ya no la vemos.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-white/80">
          No pasa nada: escríbenos por WhatsApp y lo revisamos contigo en un minuto.
        </p>
        <div className="mt-6">
          <Boton
            href={whatsappDelNegocio(
              "Hola, aparté una cita en la página pero se me perdió la confirmación. ¿Me ayudas a revisarla?",
            )}
          >
            Escribir por WhatsApp
          </Boton>
        </div>
      </div>
    </div>
  );
}

export function Confirmacion() {
  const parametros = useSearchParams();
  const id = parametros.get("id") ?? "";

  const [cita, setCita] = useState<Cita | null>(null);
  const [buscando, setBuscando] = useState(true);
  const [avisado, setAvisado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setCita(id ? (buscarCita(id) ?? null) : null);
    setBuscando(false);
  }, [id]);

  useEffect(() => {
    if (!copiado) return;
    const reloj = window.setTimeout(() => setCopiado(false), 2500);
    return () => window.clearTimeout(reloj);
  }, [copiado]);

  async function copiarCodigo(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
    } catch {
      // Algunos navegadores no dejan copiar sin permiso: el código sigue ahí para seleccionarlo.
      setCopiado(false);
    }
  }

  if (buscando) return <Esqueleto />;
  if (!cita) return <NoEncontrada />;

  const codigo = codificarCita(cita);

  return (
    <div className="aparecer mx-auto w-full max-w-2xl">
      <p className="etiqueta text-sm font-semibold uppercase tracking-widest text-white/50">
        Tu lugar quedó apartado
      </p>
      <h1 className="titular mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
        {config.gracias.titulo}
      </h1>

      <div className={`${CAJA} mt-6`}>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50">Tu cita</p>
        <p
          className="mt-2 text-2xl font-bold capitalize leading-snug sm:text-3xl"
          style={{ color: "var(--marca)" }}
        >
          {textoLargo(cita.inicio)}
        </p>
        <p className="mt-2 text-lg text-white/70">
          {config.oferta.nombre} · {cita.duracionMinutos} minutos
        </p>
      </div>

      <div
        className="mt-6 rounded-3xl border p-5 sm:p-7"
        style={{ borderColor: "rgba(37,211,102,0.35)", backgroundColor: "rgba(37,211,102,0.08)" }}
      >
        <p className="text-xl font-bold text-white">
          Falta un paso: avísale a {config.negocio.nombre}
        </p>

        <a
          href={ligaConfirmacion(cita)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAvisado(true)}
          className="mt-5 flex min-h-[4.25rem] w-full items-center justify-center rounded-2xl px-5 text-center text-xl font-extrabold transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-2xl"
          style={{ backgroundColor: VERDE, color: TINTA_SOBRE_VERDE }}
        >
          Confirmar por WhatsApp
        </a>

        <p className="mt-4 text-lg leading-relaxed text-white/85">
          Con esto le llega tu cita al negocio. Es un toque, el mensaje ya va escrito.
        </p>
        <p className="mt-3 text-base leading-relaxed text-white/60">
          Esta página no se conecta sola con {config.negocio.nombre}. Tu cita quedó guardada en este
          aparato, y el mensaje de WhatsApp es lo que la apunta en su agenda.
        </p>

        {avisado ? (
          <p role="status" className="mt-4 text-base text-white/70">
            Si WhatsApp no se abrió, vuelve a tocar el botón verde.
          </p>
        ) : null}
      </div>

      <div className={`${CAJA} mt-6`}>
        <p className="text-xl font-bold text-white">Agrega la cita a tu calendario</p>
        <p className="mt-2 text-lg text-white/70">Para que tu teléfono te avise a tiempo.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={ligaGoogleCalendar(cita)}
            target="_blank"
            rel="noopener noreferrer"
            className={ACCION}
          >
            Google Calendar
          </a>
          <button type="button" onClick={() => descargarIcs(cita)} className={ACCION}>
            Descargar el archivo
          </button>
        </div>
        <p className="mt-4 text-base text-white/55">
          El archivo sirve para iPhone, Outlook y casi cualquier calendario.
        </p>
      </div>

      <div className={`${CAJA} mt-6`}>
        <p className="text-xl font-bold text-white">Qué sigue</p>
        <p className="mt-3 text-lg leading-relaxed text-white/75">{config.gracias.mensaje}</p>
        <ol className="mt-5 space-y-4">
          {config.gracias.pasos.map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--marca) 20%, transparent)",
                  color: "var(--marca)",
                }}
              >
                {i + 1}
              </span>
              <span className="pt-1 text-lg leading-relaxed text-white/85">{paso}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="text-base text-white/55">
          Código de tu cita, por si hay que mandarlo a mano:
        </p>
        <code className="mt-2 block select-all break-all font-mono text-xs leading-relaxed text-white/70">
          {codigo}
        </code>
        <button
          type="button"
          onClick={() => void copiarCodigo(codigo)}
          className="mt-3 inline-flex min-h-[2.75rem] items-center rounded-xl border border-white/15 px-4 text-base font-medium text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)]"
        >
          {copiado ? "Copiado" : "Copiar código"}
        </button>
      </div>
    </div>
  );
}

export default Confirmacion;
