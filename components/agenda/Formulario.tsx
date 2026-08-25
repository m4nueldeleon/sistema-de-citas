"use client";

import type { ChangeEvent } from "react";

import type { Campo } from "@/lib/tipos";

type Props = {
  campos: Campo[];
  valores: Record<string, string>;
  errores: Record<string, string>;
  alCambiar: (id: string, valor: string) => void;
};

/** El id del campo en el HTML. Se comparte para poder mover el foco al primer error. */
export function idDeCampo(id: string): string {
  return `campo-${id}`;
}

const BASE =
  "campo w-full rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-base text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const UNA_LINEA = `${BASE} min-h-[3.5rem]`;
const CON_ERROR = "ring-2 ring-red-400/70";

function autocompletado(campo: Campo): string {
  if (campo.tipo === "tel") return "tel";
  if (campo.tipo === "correo") return "email";
  if (campo.id === "nombre") return "name";
  return "off";
}

function pista(campo: Campo): string {
  if (campo.tipo === "tel") return "Ejemplo: 33 1234 5678";
  if (campo.tipo === "correo") return "nombre@correo.com";
  return "";
}

export function Formulario({ campos, valores, errores, alCambiar }: Props) {
  return (
    <div className="space-y-5">
      {campos.map((campo) => {
        const id = idDeCampo(campo.id);
        const idError = `${id}-error`;
        const error = errores[campo.id];
        const valor = valores[campo.id] ?? "";
        const comunes = {
          id,
          name: campo.id,
          value: valor,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? idError : undefined,
          onChange: (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
          ) => alCambiar(campo.id, e.target.value),
        };

        return (
          <div key={campo.id}>
            <label htmlFor={id} className="mb-2 block text-base font-semibold text-white">
              {campo.etiqueta}
              {campo.requerido ? null : (
                <span className="ml-2 font-normal text-white/45">(opcional)</span>
              )}
            </label>

            {campo.tipo === "parrafo" ? (
              <textarea
                {...comunes}
                rows={3}
                autoComplete={autocompletado(campo)}
                className={`${BASE} ${error ? CON_ERROR : ""}`}
              />
            ) : campo.tipo === "opciones" ? (
              <select {...comunes} className={`${UNA_LINEA} ${error ? CON_ERROR : ""}`}>
                <option value="">Elige una opción</option>
                {(campo.opciones ?? []).map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...comunes}
                type={campo.tipo === "tel" ? "tel" : campo.tipo === "correo" ? "email" : "text"}
                inputMode={campo.tipo === "tel" ? "tel" : campo.tipo === "correo" ? "email" : "text"}
                autoComplete={autocompletado(campo)}
                placeholder={pista(campo)}
                className={`${UNA_LINEA} ${error ? CON_ERROR : ""}`}
              />
            )}

            {error ? (
              <p id={idError} className="mt-2 text-base font-medium text-red-300">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default Formulario;
