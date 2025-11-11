import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaOrdenes from "./TablaOrdenes";
import "./PrincipalOrden.css";

const PrincipalOrden = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-orden">
        <TablaOrdenes />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalOrden;
