import datos from "@/negocio.config.json";
import type { Config } from "./tipos";

export const config = datos as Config;

export const nombreNegocio = config.negocio.nombre;
