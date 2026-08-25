"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Boton } from "@/components/ui/Boton";
import { Marca } from "@/components/ui/Marca";
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
    setError("Ese código no es. Fíjate que no traiga espacios.");
  }

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="aparecer tarjeta p-6 sm:p-8">
        <Marca tamano="sm" />

        <h1 className="mt-6 text-3xl sm:text-4xl">Tu panel de citas</h1>
        <p className="mt-3 text-tinta-suave">
          Escribe tu código de acceso para ver tu agenda y tu tablero.
        </p>

        <form onSubmit={intentar} className="mt-7">
          <label htmlFor="pin" className="etiqueta">
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
            className="campo text-xl tracking-[0.4em] placeholder:tracking-normal"
            placeholder="••••"
          />

          {error ? (
            <p id="pin-error" role="alert" className="mt-3 font-medium text-red-300">
              {error}
            </p>
          ) : null}

          <div className="mt-5">
            <Boton tipo="submit" tamano="lg" anchoCompleto>
              Entrar
            </Boton>
          </div>
        </form>

        <p id="pin-nota" className="mt-6 text-[15px] leading-relaxed text-tinta-suave">
          Este candado solo evita curiosos. La información vive en este navegador; no la abras en
          una computadora compartida.
        </p>
      </div>

      <div className="mt-6">
        <Boton href="/" variante="fantasma">
          Volver a mi página
        </Boton>
      </div>
    </main>
  );
}
