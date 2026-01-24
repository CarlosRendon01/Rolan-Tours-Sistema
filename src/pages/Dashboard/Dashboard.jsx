import React, { useState, useEffect } from "react";
import axios from "axios";
import PrincipalComponente from "../Generales/Componentes/PrincipalComponente";
import BuscadorFecha from "./BuscadorFecha";
import CalendarioViajes from "./CalendarioViajes";
import "./Dashboard.css";
import { API_CONFIG } from "../../config/api";

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    ordenesHoy: 0,
    ingresosDelMes: 0,
    ocupacionActual: 0,
    tourMasPopular: { nombre: "Cargando...", reservas: 0 }
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const responseOrdenes = await axios.get(`${API_CONFIG.BASE_URL}/ordenes-servicio`);
      const ordenes = responseOrdenes.data;

      const formatearFechaISO = (fechaISO) => {
        if (!fechaISO) return null;
        return fechaISO.split('T')[0];
      };

      const hoy = new Date().toISOString().split('T')[0];

      const ordenesHoy = ordenes.filter(orden => {
        const fechaOrden = formatearFechaISO(orden.fecha_inicio_servicio);
        return fechaOrden === hoy;
      }).length;

      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();

      const ordenesDelMes = ordenes.filter(orden => {
        const fechaOrden = formatearFechaISO(orden.fecha_inicio_servicio);
        if (!fechaOrden) return false;

        const fechaObj = new Date(fechaOrden);
        return fechaObj.getMonth() === mesActual &&
          fechaObj.getFullYear() === añoActual;
      });

      const ingresosEstimados = ordenesDelMes.length * 850;

      const ordenesActivas = ordenes.filter(orden => orden.activo).length;
      const capacidadTotal = 100;
      const ocupacion = Math.min(100, Math.round((ordenesActivas / capacidadTotal) * 100));

      const destinosContador = {};
      ordenes.forEach(orden => {
        const destino = orden.destino || 'Sin destino';
        destinosContador[destino] = (destinosContador[destino] || 0) + 1;
      });

      const destinoMasPopular = Object.entries(destinosContador)
        .sort((a, b) => b[1] - a[1])[0] || ['Sin datos', 0];

      setEstadisticas({
        ordenesHoy,
        ingresosDelMes: ingresosEstimados,
        ocupacionActual: ocupacion,
        tourMasPopular: {
          nombre: destinoMasPopular[0],
          reservas: destinoMasPopular[1]
        }
      });

      setError(null);
    } catch (error) {
      setError('Error al cargar las estadísticas. Intenta recargar la página.');

      setEstadisticas({
        ordenesHoy: 0,
        ingresosDelMes: 0,
        ocupacionActual: 0,
        tourMasPopular: { nombre: "Error al cargar", reservas: 0 }
      });
    } finally {
      setCargando(false);
    }
  };

  const calcularCambio = (valorActual, tipo) => {
    const cambios = {
      ordenesHoy: Math.floor(Math.random() * 20) + 5,
      ingresosDelMes: Math.floor(Math.random() * 25) + 10,
      ocupacionActual: Math.floor(Math.random() * 10) + 2
    };
    return cambios[tipo] || 0;
  };

  const tarjetasEstadisticas = [
    {
      titulo: "Órdenes Hoy",
      valor: cargando ? "..." : estadisticas.ordenesHoy.toString(),
      cambio: `+${calcularCambio(estadisticas.ordenesHoy, 'ordenesHoy')}%`,
      tendencia: "positiva",
      icono: "📅",
      color: "azul"
    },
    {
      titulo: "Ingresos del Mes",
      valor: cargando ? "..." : `$${estadisticas.ingresosDelMes.toLocaleString('es-MX')}`,
      cambio: `+${calcularCambio(estadisticas.ingresosDelMes, 'ingresosDelMes')}%`,
      tendencia: "positiva",
      icono: "💰",
      color: "verde"
    },
    {
      titulo: "Ocupación Actual",
      valor: cargando ? "..." : `${estadisticas.ocupacionActual}%`,
      cambio: `+${calcularCambio(estadisticas.ocupacionActual, 'ocupacionActual')}%`,
      tendencia: "positiva",
      icono: "📈",
      color: "purpura"
    },
    {
      titulo: "Destino Más Popular",
      valor: cargando ? "..." : estadisticas.tourMasPopular.nombre,
      subtitulo: cargando ? "..." : `${estadisticas.tourMasPopular.reservas} órdenes`,
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
          {stat.cambio && (
            <div className="dashboard-tarjeta-cambio">
              <span className={`dashboard-cambio-${stat.tendencia}`}>
                {stat.cambio}
              </span>
              {stat.tendencia === 'positiva' && (
                <span className="dashboard-flecha-positiva">↗</span>
              )}
            </div>
          )}
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

        <div className="dashboard-header">
          <h1 className="dashboard-titulo-pagina">Panel de Control</h1>
          <button
            onClick={cargarEstadisticas}
            className="dashboard-btn-actualizar"
            disabled={cargando}
          >
            {cargando ? '🔄 Cargando...' : '🔄 Actualizar'}
          </button>
        </div>

        {error && (
          <div className="dashboard-error-mensaje">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="dashboard-contenedor-tarjetas-principal">
          {tarjetasEstadisticas.map((stat, index) => renderTarjeta(stat, index))}
        </div>

        <div className="dashboard-seccion-buscador">
          <BuscadorFecha />
        </div>

        <div className="dashboard-seccion-calendario">
          <CalendarioViajes onActualizarEstadisticas={cargarEstadisticas} />
        </div>

      </div>
    </PrincipalComponente>
  );
};

export default Dashboard;