import React from "react";
import PrincipalComponente from "../Generales/componentes/PrincipalComponente";
import BuscadorFecha from "./BuscadorFecha";
import CalendarioViajes from "./CalendarioViajes";
import "./Dashboard.css";

const Dashboard = () => {
  // Todas las estadísticas en un solo array para una fila
  const estadisticas = [
    {
      titulo: "Reservas Hoy",
      valor: "24",
      cambio: "+12%",
      tendencia: "positiva",
      icono: "📅",
      color: "azul"
    },
    {
      titulo: "Ingresos del Mes",
      valor: "$45,230",
      cambio: "+18%",
      tendencia: "positiva", 
      icono: "💰",
      color: "verde"
    },
    {
      titulo: "Ocupación Actual", 
      valor: "87%",
      cambio: "+5%",
      tendencia: "positiva",
      icono: "📈",
      color: "purpura"
    },
    {
      titulo: "Tour Más Popular",
      valor: "Oaxaca Centro",
      subtitulo: "156 reservas",
      tendencia: "neutral",
      icono: "🏆",
      color: "naranja"
    }
  ];

  const renderTarjeta = (stat, index) => (
    <div key={index} className={`dashboard-tarjeta-estadistica dashboard-tarjeta-${stat.color}`}>
      <div className="dashboard-tarjeta-contenido">
        <div className="dashboard-tarjeta-info">
          <p className="dashboard-tarjeta-titulo">{stat.titulo}</p>
          <p className="dashboard-tarjeta-valor">{stat.valor}</p>
          {stat.subtitulo && (
            <p className="dashboard-tarjeta-subtitulo">{stat.subtitulo}</p>
          )}
          <div className="dashboard-tarjeta-cambio">
            <span className={`dashboard-cambio-${stat.tendencia}`}>
              {stat.cambio}
            </span>
            {stat.tendencia === 'positiva' && (
              <span className="dashboard-flecha-positiva">↗</span>
            )}
          </div>
        </div>
        <div className="dashboard-tarjeta-icono">
          <span className="dashboard-icono">{stat.icono}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PrincipalComponente>
      <div className="dashboard-contenedor-principal">
        
        {/* Título del Dashboard */}
        <h1 className="dashboard-titulo-pagina">Panel de Control</h1>

        {/* Todas las tarjetas en una sola fila */}
        <div className="dashboard-contenedor-tarjetas-principal">
          {estadisticas.map((stat, index) => renderTarjeta(stat, index))}
        </div>
        
        {/* Sección del Buscador de Fechas */}
        <div className="dashboard-seccion-buscador">
          <BuscadorFecha />
        </div>
        
        {/* Sección del Calendario */}
        <div className="dashboard-seccion-calendario">
          <CalendarioViajes />
        </div>
        
      </div>
    </PrincipalComponente>
  );
};

export default Dashboard;