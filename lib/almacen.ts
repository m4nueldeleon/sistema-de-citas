"use client";

import type { Cita } from "./tipos";

const LLAVE = "sistema-de-citas:v1";
const LLAVE_SESION = "sistema-de-citas:panel";
const EVENTO = "sistema-de-citas:cambio";

function leerCrudo(): Cita[] {
  if (typeof window === "undefined") return [];
  try {
    const texto = window.localStorage.getItem(LLAVE);
    if (!texto) return [];
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? (datos as Cita[]) : [];
  } catch {
    return [];
  }
}

function escribir(citas: Cita[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LLAVE, JSON.stringify(citas));
    window.dispatchEvent(new Event(EVENTO));
  } catch {
    /* almacenamiento lleno o bloqueado: la app sigue funcionando en memoria */
  }
}

export function leerCitas(): Cita[] {
  return leerCrudo();
}

export function guardarCita(cita: Cita): void {
  const citas = leerCrudo().filter((c) => c.id !== cita.id);
  escribir([...citas, cita]);
}

export function borrarCita(id: string): void {
  escribir(leerCrudo().filter((c) => c.id !== id));
}

export function buscarCita(id: string): Cita | undefined {
  return leerCrudo().find((c) => c.id === id);
}

export function horariosOcupados(): string[] {
  return leerCrudo().map((c) => c.inicio);
}

export function suscribir(alCambiar: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENTO, alCambiar);
  window.addEventListener("storage", alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener("storage", alCambiar);
  };
}

export function nuevoId(): string {
  const azar = Math.random().toString(36).slice(2, 8);
  return `${Date.now().toString(36)}${azar}`.toUpperCase();
}

/** Candado ligero del panel. NO es seguridad: solo evita que alguien entre por curiosidad. */
export function abrirPanel(): void {
  try {
    window.sessionStorage.setItem(LLAVE_SESION, "1");
  } catch {
    /* ignorado */
  }
}

export function panelAbierto(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(LLAVE_SESION) === "1";
  } catch {
    return false;
  }
}

export function cerrarPanel(): void {
  try {
    window.sessionStorage.removeItem(LLAVE_SESION);
  } catch {
    /* ignorado */
  }
}
