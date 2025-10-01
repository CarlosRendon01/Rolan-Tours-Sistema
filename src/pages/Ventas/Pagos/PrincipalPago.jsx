import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaPagos from "./TablaPagos";
import "./PrincipalPago.css";

//Hola//
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