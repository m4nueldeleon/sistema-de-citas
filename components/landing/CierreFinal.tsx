import Link from "next/link";
import Boton from "@/components/ui/Boton";
import Marca from "@/components/ui/Marca";
import { config } from "@/lib/negocio";

export function CierreFinal() {
  const { landing, negocio, oferta } = config;

  return (
    <div className="mx-auto w-full max-w-3xl text-center">
      <h2 className="text-[1.75rem] leading-tight sm:text-4xl">
        {oferta.duracionMinutos} minutos hoy, o el mismo problema el mes que entra
      </h2>
      <p className="mt-5 text-lg text-tinta-suave">
        Eliges tu horario, contestas unas preguntas cortas y listo. Yo me encargo del resto.
      </p>

      <div className="mt-9 flex flex-col items-center gap-4">
        <Boton href="#agenda" tamano="lg">
          {landing.ctaTexto}
        </Boton>
        <p className="text-tinta-suave">{landing.urgencia}</p>
      </div>

      <div className="mt-14 border-t border-borde pt-8">
        <div className="flex justify-center">
          <Marca tamano="sm" />
        </div>
        <p className="mt-4 text-tinta-suave">
          {negocio.nombre} · {negocio.ciudad}
        </p>
        <p className="mt-6">
          <Link
            href="/panel"
            className="text-tinta-suave underline underline-offset-4 transition-colors hover:text-tinta"
          >
            Entrar a mi tablero
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CierreFinal;
