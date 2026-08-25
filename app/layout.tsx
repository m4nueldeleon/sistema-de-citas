import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { config } from "@/lib/negocio";
import "./globals.css";

const titulo = `${config.negocio.nombre} · ${config.oferta.nombre}`;
const descripcion = config.landing.subtitular;

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  applicationName: config.negocio.nombre,
  openGraph: {
    title: titulo,
    description: descripcion,
    siteName: config.negocio.nombre,
    locale: "es_MX",
    type: "website",
    ...(sitioValido(config.negocio.sitio) ? { url: config.negocio.sitio } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#100e0b",
};

/**
 * Los colores vienen de negocio.config.json, que edita una persona a mano.
 * Antes de meterlos en la página revisamos que de verdad sean un color:
 * así un dedazo no rompe el diseño ni deja pasar texto raro.
 */
function colorSeguro(valor: string, respaldo: string): string {
  const limpio = String(valor ?? "").trim();
  const esColor =
    /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(limpio) ||
    /^(?:rgb|rgba|hsl|hsla|oklch|oklab)\([0-9a-z%.,\s/+-]*\)$/i.test(limpio);
  return esColor ? limpio : respaldo;
}

function sitioValido(sitio: string): boolean {
  return /^https?:\/\/[^\s"'<>]+$/i.test(String(sitio ?? "").trim());
}

const variablesDeMarca = [
  ":root{",
  `--marca:${colorSeguro(config.marca.colorPrincipal, "#e9c36a")};`,
  `--acento:${colorSeguro(config.marca.colorAcento, "#6fe3ff")};`,
  "}",
].join("");

export default function DisenoRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <head>
        {/* Adelanta el saludo al servidor de tipografías: las letras cargan antes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Aquí entran los colores de negocio.config.json y pintan todo el sitio */}
        <style dangerouslySetInnerHTML={{ __html: variablesDeMarca }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
