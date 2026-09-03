import PrincipalComponente from "../Generales/Componentes/PrincipalComponente";
import DashboardViajes from "./DashboardViajes";
import "./PrincipalViajes.css";

const PrincipalViajes = () => {
  return (
    <PrincipalComponente>
      <div className="contenedor-principal-viajes">
        <DashboardViajes />
      </div>
    </PrincipalComponente>
  );
};

export default PrincipalViajes;