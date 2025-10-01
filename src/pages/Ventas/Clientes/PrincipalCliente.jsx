import React from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaClientes from "./TablaClientes";
import "./PrincipalCliente.css";

const PrincipalCliente = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-cliente">
        <TablaClientes />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalCliente;