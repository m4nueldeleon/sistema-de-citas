import { config } from "@/lib/negocio";

export function Dolores() {
  const { dolores } = config.landing;

  return (
    <div>
      <h2 className="max-w-2xl text-[1.75rem] leading-tight sm:text-4xl">
        Si te pasa esto, esta sesión es para ti
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
        Nada de esto se arregla trabajando más. Se arregla con orden.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {dolores.map((d, i) => (
          <li key={d.titulo} className="tarjeta flex h-full flex-col p-6">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full text-lg font-semibold text-marca"
              style={{ backgroundColor: "color-mix(in oklab, var(--marca) 16%, transparent)" }}
            >
              {i + 1}
            </span>
            <h3 className="mt-5 text-xl leading-snug">{d.titulo}</h3>
            <p className="mt-3 text-tinta-suave">{d.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dolores;
