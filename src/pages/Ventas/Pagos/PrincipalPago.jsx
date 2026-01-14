import React from "react";
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente";
import TablaPagos from "./TablaPagos";
import "./PrincipalPago.css";

const PrincipalPago = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-pago">
        <TablaPagos />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalPago;
