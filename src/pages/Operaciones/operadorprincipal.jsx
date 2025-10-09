import React from "react";
import PrincipalComponente from "../Generales/componentes/PrincipalComponente.jsx";
import VehiculosPrincipal from "./Vehiculos/VehiculosPrincipal.jsx";

const OperadorPrincipal = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-operador">
        <VehiculosPrincipal />
      </div>
    </PrincipalComponente>
  );
};

export default OperadorPrincipal;