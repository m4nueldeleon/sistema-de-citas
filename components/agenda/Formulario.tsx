"use client";

import type { ChangeEvent } from "react";

import type { Campo } from "@/lib/tipos";

type Props = {
  campos: Campo[];
  valores: Record<string, string>;
  errores: Record<string, string>;
  alCambiar: (id: string, valor: string) => void;
};

/** El id del campo dentro del HTML. Se comparte para poder mover el foco al primer error. */
export function idDeCampo(id: string): string {
  return `campo-${id}`;
}

/* .campo ya trae el tamaño, el borde y el aro de foco (app/globals.css) */
const MARCA_DE_ERROR = "border-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.22)]";

function autocompletado(campo: Campo): string {
  if (campo.tipo === "tel") return "tel";
  if (campo.tipo === "correo") return "email";
  if (campo.id === "nombre") return "name";
  return "off";
}

function pista(campo: Campo): string {
  if (campo.tipo === "tel") return "33 1234 5678";
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
        const clases = `campo ${error ? MARCA_DE_ERROR : ""}`;

        const comunes = {
          id,
          name: campo.id,
          value: valores[campo.id] ?? "",
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? idError : undefined,
          onChange: (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
          ) => alCambiar(campo.id, e.target.value),
        };

        return (
          <div key={campo.id}>
            <label htmlFor={id} className="etiqueta">
              {campo.etiqueta}
              {campo.requerido ? null : <span className="opcional"> (opcional)</span>}
            </label>

            {campo.tipo === "parrafo" ? (
              <textarea {...comunes} rows={3} className={clases} />
            ) : campo.tipo === "opciones" ? (
              <select {...comunes} className={clases}>
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
                className={clases}
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
