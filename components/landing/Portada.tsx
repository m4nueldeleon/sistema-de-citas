import Boton from "@/components/ui/Boton";
import Marca from "@/components/ui/Marca";
import { config } from "@/lib/negocio";

/** Adorno de fondo hecho en casa: degradado de marca + formas SVG.
 *  Nada de imágenes externas, así el sitio se ve igual aunque falle internet. */
function Fondo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(64rem 34rem at 4% -14%, color-mix(in oklab, var(--marca) 16%, transparent), transparent 62%)," +
            "radial-gradient(52rem 30rem at 104% 4%, color-mix(in oklab, var(--acento) 11%, transparent), transparent 64%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        style={{
          maskImage: "linear-gradient(to bottom, black, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 78%)",
        }}
      >
        <defs>
          <pattern id="portada-puntos" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.6" r="1.6" fill="var(--marca)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#portada-puntos)" />
      </svg>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="absolute -right-28 -top-32 h-[30rem] w-[30rem] opacity-30 sm:h-[40rem] sm:w-[40rem]"
      >
        {[70, 110, 150, 190].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} stroke="var(--marca)" strokeWidth="0.8" />
        ))}
        <circle cx="200" cy="200" r="34" fill="color-mix(in oklab, var(--acento) 20%, transparent)" />
      </svg>
    </div>
  );
}

function Reloj() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Precio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
      <path
        d="M12.6 3.4H20v7.4l-9 9-7.4-7.4 9-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16.2" cy="7.8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Escudo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
      <path
        d="M12 3l7 3v5.4c0 4-2.9 7.5-7 8.6-4.1-1.1-7-4.6-7-8.6V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2.2 2.2L15.4 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Portada() {
  const { landing, oferta } = config;

  const senales = [
    { icono: <Reloj />, titulo: `${oferta.duracionMinutos} minutos`, texto: "Empieza y termina a tiempo" },
    { icono: <Precio />, titulo: oferta.precioTexto, texto: "Sin letras chiquitas" },
    { icono: <Escudo />, titulo: "Sin compromiso", texto: "Si no te sirve, me lo dices y ya" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <Fondo />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <Marca tamano="md" />

        <div className="aparecer">
          <h1 className="titular mt-12 max-w-3xl sm:mt-16">{landing.titular}</h1>
          <p className="subtitular mt-6 max-w-2xl">{landing.subtitular}</p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Boton href="#agenda" tamano="lg">
              {landing.ctaTexto}
            </Boton>
            <p className="text-tinta-suave">{landing.urgencia}</p>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3">
          {senales.map((s) => (
            <li key={s.titulo} className="vidrio flex items-start gap-3 p-5">
              <span className="text-marca">{s.icono}</span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold">{s.titulo}</span>
                <span className="mt-1 block text-tinta-suave">{s.texto}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Portada;
