import { config } from "@/lib/negocio";

export function Beneficios() {
  const { beneficios } = config.landing;

  return (
    <div>
      <h2 className="max-w-2xl text-[1.75rem] leading-tight sm:text-4xl">
        Cómo se ve tu semana después
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
        La meta no es que le muevas más. Es que dejes de perder gente en el camino.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {beneficios.map((b) => (
          <li key={b.titulo} className="tarjeta flex h-full flex-col p-6">
            <span aria-hidden className="block h-1.5 w-12 rounded-full bg-marca" />
            <h3 className="mt-5 text-xl leading-snug">{b.titulo}</h3>
            <p className="mt-3 text-tinta-suave">{b.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Beneficios;
