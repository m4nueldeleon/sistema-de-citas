import { config } from "@/lib/negocio";

function Si() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 h-6 w-6 shrink-0 text-marca">
      <path
        d="M6 12.4l3.6 3.6L18 7.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function No() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 h-6 w-6 shrink-0 text-tinta-suave">
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ParaQuien() {
  const { paraQuien, noParaQuien } = config.landing;

  return (
    <div>
      <h2 className="max-w-2xl text-[1.75rem] leading-tight sm:text-4xl">
        Antes de que apartes tu lugar, léelo
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
        Prefiero decírtelo ahorita y no hacerte perder media hora. Esta sesión no es para todos, y
        eso es a propósito: filtrar bien es justo lo que hace que valga la pena para quien sí entra.
        Si te ves en la lista de la izquierda, aparta tu horario. Si te ves en la derecha, mejor no
        lo hagas.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="tarjeta p-6 sm:p-7">
          <h3 className="text-xl text-marca">Es para ti si…</h3>
          <ul className="mt-5 space-y-4">
            {paraQuien.map((linea) => (
              <li key={linea} className="flex items-start gap-3">
                <Si />
                <span>{linea}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tarjeta p-6 sm:p-7">
          <h3 className="text-xl">No es para ti si…</h3>
          <ul className="mt-5 space-y-4">
            {noParaQuien.map((linea) => (
              <li key={linea} className="flex items-start gap-3 text-tinta-suave">
                <No />
                <span>{linea}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ParaQuien;
