import type { ReactNode } from "react";

type Variante = "principal" | "secundario" | "fantasma";
type Tamano = "md" | "lg";

type Props = {
  children: ReactNode;
  /** principal = la acción que queremos que hagan. secundario = alternativa. fantasma = discreto. */
  variante?: Variante;
  tamano?: Tamano;
  /** Si le pasas href se convierte en liga; si no, es botón. */
  href?: string;
  /** Abre la liga en otra pestaña (útil para WhatsApp y calendario). */
  nuevaPestana?: boolean;
  onClick?: () => void;
  tipo?: "button" | "submit";
  deshabilitado?: boolean;
  anchoCompleto?: boolean;
  etiquetaAccesible?: string;
  titulo?: string;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold " +
  "no-underline select-none cursor-pointer transition-[transform,filter,background-color,border-color] " +
  "duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 " +
  "disabled:active:translate-y-0";

const porTamano: Record<Tamano, string> = {
  md: "min-h-12 px-6 text-[1.0625rem]",
  lg: "min-h-14 px-8 text-[1.125rem]",
};

const porVariante: Record<Variante, string> = {
  principal:
    "bg-marca text-sobre-marca shadow-[0_14px_34px_-14px_var(--marca)] hover:brightness-110",
  secundario:
    "bg-transparent text-tinta border border-borde hover:border-marca hover:bg-[color-mix(in_oklab,var(--marca)_10%,transparent)]",
  fantasma:
    "bg-transparent text-tinta-suave hover:text-tinta hover:bg-[color-mix(in_oklab,var(--tinta)_8%,transparent)]",
};

export default function Boton({
  children,
  variante = "principal",
  tamano = "md",
  href,
  nuevaPestana = false,
  onClick,
  tipo = "button",
  deshabilitado = false,
  anchoCompleto = false,
  etiquetaAccesible,
  titulo,
  className = "",
}: Props) {
  const clases = [
    base,
    porTamano[tamano],
    porVariante[variante],
    anchoCompleto ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !deshabilitado) {
    return (
      <a
        href={href}
        className={clases}
        onClick={onClick}
        aria-label={etiquetaAccesible}
        title={titulo}
        {...(nuevaPestana ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={tipo}
      className={clases}
      onClick={onClick}
      disabled={deshabilitado}
      aria-label={etiquetaAccesible}
      title={titulo}
    >
      {children}
    </button>
  );
}

/* También como exportación con nombre, para poder importarlo de las dos formas. */
export { Boton };
