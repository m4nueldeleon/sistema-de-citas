"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { config } from "@/lib/negocio";

/** Candado del panel. No es seguridad real: solo evita que alguien entre por curiosidad. */
export function Entrada({ alEntrar }: { alEntrar: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function intentar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (pin.trim() === String(config.crm.pin)) {
      setError("");
      alEntrar();
      return;
    }
    setError("Ese código no es. Revisa que no traiga espacios.");
  }

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="aparecer rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <p
          className="text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--marca)" }}
        >
          {config.negocio.nombre}
        </p>

        <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Tu panel de citas
        </h1>
        <p className="mt-3 text-base leading-relaxed text-white/70">
          Escribe tu código de acceso para ver tu agenda y tu tablero.
        </p>

        <form onSubmit={intentar} className="mt-7">
          <label htmlFor="pin" className="block text-base font-medium text-white">
            Código de acceso
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "pin-error" : "pin-nota"}
            className="mt-2 h-14 w-full rounded-2xl border border-white/15 bg-black/30 px-4 text-xl tracking-[0.4em] text-white placeholder:tracking-normal placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            placeholder="••••"
          />

          {error ? (
            <p id="pin-error" role="alert" className="mt-3 text-base font-medium text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            style={{ backgroundColor: "var(--marca)" }}
          >
            Entrar
          </button>
        </form>

        <p id="pin-nota" className="mt-6 text-[15px] leading-relaxed text-white/55">
          Este candado solo evita curiosos. La información vive en este navegador; no la abras en
          una computadora compartida.
        </p>
      </div>

      <a
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center text-base text-white/60 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
      >
        Volver a mi página
      </a>
    </main>
  );
}
