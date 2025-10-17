import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaContratos from "./TablaContratos";
import "./PrincipalContrato.css";

const PrincipalContrato = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-contrato">
        <TablaContratos />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalContrato;