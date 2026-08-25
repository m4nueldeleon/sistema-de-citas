"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Boton from "@/components/ui/Boton";
import { guardarCita, horariosOcupados, nuevoId } from "@/lib/almacen";
import { diasDisponibles, textoCorto, textoHora } from "@/lib/fechas";
import { config } from "@/lib/negocio";
import type { Campo, Cita } from "@/lib/tipos";
import { avisarWebhook } from "@/lib/webhook";

import { Formulario, idDeCampo } from "./Formulario";
import { SelectorDia, type DiaDisponible } from "./SelectorDia";
import { SelectorHora } from "./SelectorHora";

type Paso = 1 | 2 | 3;

const TITULOS: Record<Paso, string> = {
  1: "Elige el día que te acomoda",
  2: "Ahora escoge la hora",
  3: "Solo faltan tus datos",
};

function whatsappDelNegocio(mensaje: string): string {
  const numero = config.negocio.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** De dónde llegó la persona: ?origen=instagram, ?origen=whatsapp, etc. */
function origenDeLaDireccion(): string {
  if (typeof window === "undefined") return "directo";
  const crudo = new URLSearchParams(window.location.search).get("origen") ?? "";
  const limpio = crudo.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  return limpio || "directo";
}

function validar(campos: Campo[], valores: Record<string, string>): Record<string, string> {
  const errores: Record<string, string> = {};

  for (const campo of campos) {
    const valor = (valores[campo.id] ?? "").trim();

    if (campo.requerido && !valor) {
      errores[campo.id] = "Este dato nos hace falta para apartar tu lugar.";
      continue;
    }
    if (!valor) continue;

    if (campo.tipo === "tel" && valor.replace(/\D/g, "").length < 10) {
      errores[campo.id] = "Escribe tu número completo con lada, son 10 dígitos.";
    }
    if (campo.tipo === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      errores[campo.id] = "Revisa tu correo. Debe verse así: nombre@correo.com";
    }
  }

  return errores;
}

/** El paso que se puede mostrar de verdad, con lo que la persona ya eligió. */
function vistaActual(paso: Paso, hayDia: boolean, hayHora: boolean): Paso {
  if (paso === 3 && hayDia && hayHora) return 3;
  if (paso >= 2 && hayDia) return 2;
  return 1;
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-borde bg-superficie px-4 py-2 text-sm">
      <span className="text-tinta-suave">{etiqueta}</span>
      <span className="font-semibold capitalize text-tinta">{valor}</span>
    </span>
  );
}

export function Agenda() {
  const router = useRouter();
  const campos = config.formulario.campos;

  const [dias, setDias] = useState<DiaDisponible[] | null>(null);
  const [paso, setPaso] = useState<Paso>(1);
  const [claveDia, setClaveDia] = useState<string | null>(null);
  const [inicio, setInicio] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [origen, setOrigen] = useState("directo");

  const encabezado = useRef<HTMLHeadingElement>(null);

  // Los horarios apartados viven en este navegador. Se calculan ya montada la
  // página para que el servidor y el navegador pinten lo mismo al arrancar.
  useEffect(() => {
    setDias(diasDisponibles(horariosOcupados()));
    setOrigen(origenDeLaDireccion());
  }, []);

  const diaActivo = useMemo(
    () => dias?.find((dia) => dia.clave === claveDia) ?? null,
    [dias, claveDia],
  );

  const vista = vistaActual(paso, Boolean(diaActivo), Boolean(inicio));
  const vistaAnterior = useRef<Paso>(vista);

  // Al cambiar de paso, el lector de pantalla y el teclado se van al título nuevo.
  useEffect(() => {
    if (vistaAnterior.current === vista) return;
    vistaAnterior.current = vista;
    encabezado.current?.focus({ preventScroll: true });
  }, [vista]);

  function elegirDia(dia: DiaDisponible) {
    setClaveDia(dia.clave);
    setInicio(null);
    setAviso(null);
    setPaso(2);
  }

  function elegirHora(valor: string) {
    setInicio(valor);
    setAviso(null);
    setPaso(3);
  }

  function atras() {
    setAviso(null);
    setPaso((actual) => (actual === 3 ? 2 : 1));
  }

  function cambiarCampo(id: string, valor: string) {
    setRespuestas((previas) => ({ ...previas, [id]: valor }));
    setErrores((previos) => {
      if (!previos[id]) return previos;
      const copia = { ...previos };
      delete copia[id];
      return copia;
    });
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!inicio || enviando) return;

    const fallas = validar(campos, respuestas);
    setErrores(fallas);
    const primerError = campos.find((campo) => fallas[campo.id]);
    if (primerError) {
      document.getElementById(idDeCampo(primerError.id))?.focus();
      return;
    }

    // Alguien pudo apartar ese horario mientras la persona llenaba sus datos.
    if (horariosOcupados().includes(inicio)) {
      const frescos = diasDisponibles(horariosOcupados());
      const sigueElDia = frescos.some((dia) => dia.clave === claveDia);
      setDias(frescos);
      setInicio(null);
      if (!sigueElDia) setClaveDia(null);
      setPaso(sigueElDia ? 2 : 1);
      setAviso("Ese horario se acaba de ocupar. Escoge otro, por favor.");
      return;
    }

    const limpias: Record<string, string> = {};
    for (const campo of campos) {
      const valor = (respuestas[campo.id] ?? "").trim();
      if (valor) limpias[campo.id] = valor;
    }

    setEnviando(true);
    const cita: Cita = {
      id: nuevoId(),
      inicio,
      duracionMinutos: config.agenda.duracionMinutos,
      etapa: "nuevo",
      creada: new Date().toISOString(),
      respuestas: limpias,
      notas: [],
      origen,
    };

    guardarCita(cita);
    void avisarWebhook(cita);
    router.push(`/gracias?id=${cita.id}`);
  }

  const cargando = dias === null;
  const sinLugares = dias !== null && dias.length === 0;

  return (
    <div className="tarjeta mx-auto w-full max-w-2xl p-5 sm:p-8">
      <div className="flex min-h-[2.75rem] items-center justify-between gap-4">
        {vista > 1 ? (
          <Boton variante="fantasma" onClick={atras}>
            <span aria-hidden="true">←</span> Atrás
          </Boton>
        ) : (
          <span />
        )}
        <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">
          Paso {vista} de 3
        </p>
      </div>

      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= vista ? "bg-marca" : "bg-borde"}`}
          />
        ))}
      </div>

      <h2
        ref={encabezado}
        tabIndex={-1}
        className="mt-5 text-2xl outline-none sm:text-3xl"
      >
        {sinLugares ? "Por ahora no hay horarios abiertos" : TITULOS[vista]}
      </h2>

      <p className="sr-only" aria-live="polite">
        Paso {vista} de 3: {TITULOS[vista]}
      </p>

      {(diaActivo || inicio) && !sinLugares ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {diaActivo ? <Dato etiqueta="Día" valor={textoCorto(diaActivo.horarios[0])} /> : null}
          {inicio ? <Dato etiqueta="Hora" valor={textoHora(inicio)} /> : null}
        </div>
      ) : null}

      {aviso ? (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-base text-amber-100"
        >
          {aviso}
        </p>
      ) : null}

      <div className="mt-6">
        {cargando ? (
          <div className="flex gap-3 overflow-hidden" aria-hidden="true">
            {[0, 1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[5.75rem] min-w-[8.75rem] shrink-0 animate-pulse rounded-2xl border border-borde bg-superficie"
              />
            ))}
          </div>
        ) : sinLugares ? (
          <div className="aparecer">
            <p className="text-[1.0625rem] leading-relaxed text-tinta-suave">
              Se llenaron los espacios de los próximos días. Escríbeme por WhatsApp y buscamos un
              hueco entre los dos.
            </p>
            <div className="mt-6">
              <Boton
                href={whatsappDelNegocio(
                  `Hola, quiero apartar una ${config.oferta.nombre.toLowerCase()} pero no veo horarios libres. ¿Qué día tienes?`,
                )}
                tamano="lg"
                nuevaPestana
              >
                Escribirle a {config.negocio.nombre}
              </Boton>
            </div>
          </div>
        ) : vista === 1 ? (
          <div className="aparecer">
            <p className="mb-4 text-[1.0625rem] text-tinta-suave">
              {config.oferta.nombre} · {config.agenda.duracionMinutos} minutos ·{" "}
              {config.oferta.precioTexto}
            </p>
            <SelectorDia dias={dias ?? []} claveActiva={claveDia} alElegir={elegirDia} />
          </div>
        ) : vista === 2 && diaActivo ? (
          <div className="aparecer">
            <p className="mb-4 text-[1.0625rem] text-tinta-suave">
              Horarios libres del{" "}
              <span className="capitalize text-tinta">{textoCorto(diaActivo.horarios[0])}</span>.
              Cada cita dura {config.agenda.duracionMinutos} minutos.
            </p>
            <SelectorHora horarios={diaActivo.horarios} activo={inicio} alElegir={elegirHora} />
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="aparecer">
            <p className="mb-5 text-[1.0625rem] text-tinta-suave">
              Con esto apartamos tu lugar. No hay que crear cuenta ni contraseña.
            </p>

            {Object.keys(errores).length > 0 ? (
              <p
                role="alert"
                className="mb-5 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-base text-red-100"
              >
                Revisa los datos marcados en rojo y lo intentamos de nuevo.
              </p>
            ) : null}

            <Formulario
              campos={campos}
              valores={respuestas}
              errores={errores}
              alCambiar={cambiarCampo}
            />

            <div className="mt-7">
              <Boton tipo="submit" tamano="lg" anchoCompleto deshabilitado={enviando}>
                {enviando ? "Apartando tu lugar…" : "Apartar mi lugar"}
              </Boton>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-tinta-suave">
              Al apartar, abrimos una pantalla para que mandes el aviso por WhatsApp. Ese mensaje es
              el que le avisa a {config.negocio.nombre} que vas.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Agenda;
