import { config } from "@/lib/negocio";

export function Preguntas() {
  const { preguntas } = config.landing;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="text-[1.75rem] leading-tight sm:text-4xl">Lo que casi siempre me preguntan</h2>

      <div className="mt-8 space-y-3">
        {preguntas.map((f) => (
          <details key={f.p} className="tarjeta group px-5 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              <span>{f.p}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-6 w-6 shrink-0 text-marca transition-transform duration-200 group-open:rotate-180"
              >
                <path
                  d="M6 9.5l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="pb-6 pr-9 text-tinta-suave">{f.r}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default Preguntas;
