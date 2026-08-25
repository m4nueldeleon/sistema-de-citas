import { config } from "@/lib/negocio";

function Palomita() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 h-6 w-6 shrink-0">
      <circle cx="12" cy="12" r="10" fill="color-mix(in oklab, var(--marca) 18%, transparent)" />
      <path
        d="M7.6 12.3l3 3 5.8-6"
        stroke="var(--marca)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Oferta() {
  const { oferta } = config;

  const datos = [
    { titulo: "Qué es", valor: oferta.nombre },
    { titulo: "Cuánto dura", valor: `${oferta.duracionMinutos} minutos` },
    { titulo: "Cuánto cuesta", valor: oferta.precioTexto },
  ];

  return (
    <div>
      <h2 className="max-w-2xl text-[1.75rem] leading-tight sm:text-4xl">
        Esto es exactamente lo que vas a apartar
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
        Sin rodeos: qué es, cuánto dura y qué te llevas de regreso.
      </p>

      <div className="tarjeta mt-10 p-6 sm:p-9">
        <dl className="grid gap-6 sm:grid-cols-3">
          {datos.map((d) => (
            <div key={d.titulo}>
              <dt className="etiqueta text-tinta-suave">{d.titulo}</dt>
              <dd className="text-xl font-semibold leading-snug">{d.valor}</dd>
            </div>
          ))}
        </dl>

        <hr className="my-7 border-0 border-t border-borde" />

        <h3 className="text-lg">Lo que incluye</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {oferta.incluye.map((linea) => (
            <li key={linea} className="flex items-start gap-3">
              <Palomita />
              <span>{linea}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Oferta;
