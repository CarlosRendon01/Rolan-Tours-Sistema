import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import Cotizaciones from "./cotizaciones";
const PrincipalCotizacion = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-cliente">
        <Cotizaciones />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalCotizacion;
