import Seccion from "@/components/ui/Seccion";
import { config } from "@/lib/negocio";

/** Esta sección se pone sola: si el negocio todavía no cargó comentarios reales
 *  en negocio.config.json, no se muestra nada. Nunca inventamos testimonios. */
export function Prueba() {
  const { prueba } = config.landing;
  if (!prueba.activa || prueba.items.length === 0) return null;

  return (
    <Seccion tono="claro">
      <h2 className="max-w-2xl text-[1.75rem] leading-tight sm:text-4xl">
        Lo que dicen quienes ya la tuvieron
      </h2>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {prueba.items.map((item) => (
          <li key={`${item.autor}-${item.texto.slice(0, 24)}`} className="tarjeta p-6 sm:p-7">
            <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 text-marca">
              <path
                fill="currentColor"
                d="M9.6 5.4C6.5 6.8 4.6 9.6 4.6 13v5.6h6.2V13H8.1c0-2 .9-3.5 2.7-4.4l-1.2-3.2Zm9 0C15.5 6.8 13.6 9.6 13.6 13v5.6h6.2V13h-2.7c0-2 .9-3.5 2.7-4.4l-1.2-3.2Z"
              />
            </svg>
            <blockquote className="mt-4 text-lg">{item.texto}</blockquote>
            <p className="mt-4 text-tinta-suave">— {item.autor}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

export default Prueba;
