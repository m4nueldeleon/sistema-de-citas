import Seccion from "@/components/ui/Seccion";
import { Agenda } from "@/components/agenda/Agenda";
import Portada from "@/components/landing/Portada";
import Dolores from "@/components/landing/Dolores";
import Oferta from "@/components/landing/Oferta";
import Beneficios from "@/components/landing/Beneficios";
import ParaQuien from "@/components/landing/ParaQuien";
import Prueba from "@/components/landing/Prueba";
import Preguntas from "@/components/landing/Preguntas";
import CierreFinal from "@/components/landing/CierreFinal";
import BarraFija from "@/components/landing/BarraFija";

export default function Pagina() {
  return (
    <main>
      <Portada />

      <Seccion tono="oscuro">
        <Dolores />
      </Seccion>

      <Seccion tono="claro">
        <Oferta />
      </Seccion>

      <Seccion tono="claro">
        <Beneficios />
      </Seccion>

      <Seccion id="agenda" tono="oscuro">
        <Agenda />
      </Seccion>

      <Seccion tono="oscuro">
        <ParaQuien />
      </Seccion>

      {/* Solo aparece si el negocio cargó comentarios reales; si no, se salta sola */}
      <Prueba />

      <Seccion tono="claro">
        <Preguntas />
      </Seccion>

      <Seccion tono="oscuro">
        <CierreFinal />
      </Seccion>

      <BarraFija />
    </main>
  );
}
