import React from "react";
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente.jsx";
import VehiculosPrincipal from "./VehiculosPrincipal.jsx";

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