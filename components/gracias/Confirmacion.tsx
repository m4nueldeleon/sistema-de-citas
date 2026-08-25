"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Boton from "@/components/ui/Boton";
import { buscarCita } from "@/lib/almacen";
import { descargarIcs, ligaGoogleCalendar } from "@/lib/calendario";
import { codificarCita } from "@/lib/codigo";
import { textoLargo } from "@/lib/fechas";
import { config } from "@/lib/negocio";
import type { Cita } from "@/lib/tipos";
import { ligaConfirmacion } from "@/lib/whatsapp";

/* El verde de WhatsApp: la gente lo reconoce antes de leer el botón. */
const VERDE = "#25d366";
const TINTA_SOBRE_VERDE = "#07240f";

function whatsappDelNegocio(mensaje: string): string {
  const numero = config.negocio.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function Esqueleto() {
  return (
    <div className="mx-auto w-full max-w-2xl" aria-hidden="true">
      <div className="h-5 w-40 animate-pulse rounded-full bg-superficie" />
      <div className="mt-4 h-12 w-3/4 animate-pulse rounded-2xl bg-superficie" />
      <div className="mt-6 h-32 animate-pulse rounded-2xl bg-superficie" />
      <div className="mt-6 h-44 animate-pulse rounded-2xl bg-superficie" />
    </div>
  );
}

function NoEncontrada() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-3xl sm:text-4xl">Aquí no aparece tu cita</h1>

      <div className="tarjeta mt-6 p-5 sm:p-7">
        <p className="text-[1.0625rem] leading-relaxed text-tinta-suave">
          Tu cita se guarda en el teléfono o la computadora donde la apartaste. Si abriste esta
          página en otro aparato, en otro navegador, o si borraste los datos de navegación, aquí ya
          no la vemos.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-tinta-suave">
          No pasa nada: escríbenos por WhatsApp y lo revisamos contigo en un minuto.
        </p>
        <div className="mt-6">
          <Boton
            href={whatsappDelNegocio(
              "Hola, aparté una cita en la página pero se me perdió la confirmación. ¿Me ayudas a revisarla?",
            )}
            tamano="lg"
            nuevaPestana
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
      // Hay navegadores que no dejan copiar solos: el código sigue ahí para seleccionarlo a mano.
      setCopiado(false);
    }
  }

  if (buscando) return <Esqueleto />;
  if (!cita) return <NoEncontrada />;

  const codigo = codificarCita(cita);

  return (
    <div className="aparecer mx-auto w-full max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">
        Tu lugar quedó apartado
      </p>
      <h1 className="titular mt-3">{config.gracias.titulo}</h1>

      <div className="tarjeta mt-7 p-5 sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">Tu cita</p>
        <p className="mt-2 font-display text-2xl font-semibold capitalize leading-snug text-marca sm:text-3xl">
          {textoLargo(cita.inicio)}
        </p>
        <p className="mt-2 text-[1.0625rem] text-tinta-suave">
          {config.oferta.nombre} · {cita.duracionMinutos} minutos
        </p>
      </div>

      {/* La acción más importante de toda la página: sin este mensaje, el negocio no se entera. */}
      <div
        className="mt-6 rounded-tarjeta border p-5 sm:p-7"
        style={{
          borderColor: "color-mix(in oklab, #25d366 38%, transparent)",
          backgroundColor: "color-mix(in oklab, #25d366 9%, transparent)",
        }}
      >
        <p className="font-display text-xl font-semibold text-tinta sm:text-2xl">
          Falta un paso: avísale a {config.negocio.nombre}
        </p>

        <a
          href={ligaConfirmacion(cita)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAvisado(true)}
          className="mt-5 flex min-h-[4.5rem] w-full items-center justify-center rounded-full px-5 text-center text-xl font-bold no-underline transition duration-150 hover:brightness-105 active:translate-y-px sm:text-2xl"
          style={{ backgroundColor: VERDE, color: TINTA_SOBRE_VERDE }}
        >
          Confirmar por WhatsApp
        </a>

        <p className="mt-4 text-[1.0625rem] leading-relaxed text-tinta">
          Con esto le llega tu cita al negocio. Es un toque, el mensaje ya va escrito.
        </p>
        <p className="mt-3 text-base leading-relaxed text-tinta-suave">
          Esta página no se conecta sola con {config.negocio.nombre}: tu cita quedó guardada en este
          aparato y el mensaje de WhatsApp es lo que la apunta en su agenda.
        </p>

        {avisado ? (
          <p role="status" className="mt-4 text-base text-tinta-suave">
            Si WhatsApp no se abrió, vuelve a tocar el botón verde.
          </p>
        ) : null}
      </div>

      <div className="tarjeta mt-6 p-5 sm:p-7">
        <p className="font-display text-xl font-semibold text-tinta">
          Agrega la cita a tu calendario
        </p>
        <p className="mt-2 text-[1.0625rem] text-tinta-suave">
          Para que tu teléfono te avise a tiempo.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Boton variante="secundario" href={ligaGoogleCalendar(cita)} nuevaPestana anchoCompleto>
            Google Calendar
          </Boton>
          <Boton variante="secundario" onClick={() => descargarIcs(cita)} anchoCompleto>
            Descargar el archivo
          </Boton>
        </div>

        <p className="mt-4 text-base text-tinta-suave">
          El archivo sirve para iPhone, Outlook y casi cualquier otro calendario.
        </p>
      </div>

      <div className="tarjeta mt-6 p-5 sm:p-7">
        <p className="font-display text-xl font-semibold text-tinta">Qué sigue</p>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-tinta-suave">
          {config.gracias.mensaje}
        </p>

        <ol className="mt-5 space-y-4">
          {config.gracias.pasos.map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-marca text-base font-semibold text-marca">
                {i + 1}
              </span>
              <span className="pt-1 text-[1.0625rem] leading-relaxed text-tinta">{paso}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 rounded-2xl border border-borde p-4">
        <p className="text-base text-tinta-suave">
          Código de tu cita, por si hay que mandarlo a mano:
        </p>
        <code className="mt-2 block break-all select-all font-mono text-sm leading-relaxed text-tinta-suave">
          {codigo}
        </code>
        <button
          type="button"
          onClick={() => void copiarCodigo(codigo)}
          className="mt-3 inline-flex min-h-11 items-center rounded-full border border-borde px-4 text-base font-medium text-tinta-suave transition hover:border-marca hover:text-tinta"
        >
          {copiado ? "Copiado" : "Copiar código"}
        </button>
      </div>
    </div>
  );
}

export default Confirmacion;
