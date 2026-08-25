import type { Metadata } from "next";
import { config } from "@/lib/negocio";
import { Panel } from "@/components/panel/Panel";

export const metadata: Metadata = {
  title: `Panel · ${config.negocio.nombre}`,
  description: "Tus citas, tu agenda del día y tu tablero de seguimiento.",
  robots: { index: false, follow: false },
};

export default function PaginaPanel() {
  return <Panel />;
}
