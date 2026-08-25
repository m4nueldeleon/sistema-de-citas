import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  /** "claro" levanta un poco el fondo para dar un descanso entre bloques. */
  tono?: "oscuro" | "claro";
  /** "angosto" sirve para formularios y textos largos. */
  ancho?: "normal" | "angosto";
  className?: string;
};

const porTono: Record<"oscuro" | "claro", string> = {
  oscuro: "",
  claro:
    "bg-[color-mix(in_oklab,var(--superficie)_96%,var(--marca))] " +
    "border-y border-[color-mix(in_oklab,var(--tinta)_9%,transparent)]",
};

const porAncho: Record<"normal" | "angosto", string> = {
  normal: "max-w-6xl",
  angosto: "max-w-2xl",
};

export default function Seccion({
  children,
  id,
  tono = "oscuro",
  ancho = "normal",
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={["w-full", porTono[tono], className].filter(Boolean).join(" ")}
    >
      <div
        className={[
          porAncho[ancho],
          "mx-auto w-full px-5 py-14 sm:px-8 sm:py-20 lg:py-24",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}

/* También como exportación con nombre, para poder importarlo de las dos formas. */
export { Seccion };
