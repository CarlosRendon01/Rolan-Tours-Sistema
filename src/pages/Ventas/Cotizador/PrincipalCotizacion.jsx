import React from "react";
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente";
import Cotizaciones from "./Cotizaciones";
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
