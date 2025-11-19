import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente.jsx";
import VehiculosPrincipal from "./VehiculosPrincipal.jsx";
// ← YA NO IMPORTES VehiculosProvider aquí

const OperadorPrincipal = () => {
  return (
    <PrincipalComponente>
      {/* ← QUITA VehiculosProvider de aquí */}
      <div className="contenedor-principal-operador">
        <VehiculosPrincipal />
      </div>
    </PrincipalComponente>
  );
};

export default OperadorPrincipal;
