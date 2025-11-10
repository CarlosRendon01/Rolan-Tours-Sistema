import React from "react";
import TablaReservas from "./Componentes/TablaReservas";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import "./ReservasPrincipal.css";

const ReservasPrincipal = () => {
  return (
    <PrincipalComponente>
      <div className="reservas-principal">
        <TablaReservas />
      </div>
    </PrincipalComponente>
  );
};

export default ReservasPrincipal;
