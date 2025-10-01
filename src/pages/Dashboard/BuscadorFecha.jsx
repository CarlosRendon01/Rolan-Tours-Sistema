import React, { useState } from "react";
import { 
  Calendar, 
  Search, 
  X, 
  History,
  AlertCircle
} from "lucide-react";
import ModalResultadosFechas from "./ModalResultadosFechas";
import "./BuscadorFecha.css";

const BuscadorFecha = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [errores, setErrores] = useState({});

  // Obtener fecha actual en formato YYYY-MM-DD
  const fechaActual = new Date().toISOString().split('T')[0];

  const validarFechas = (desde, hasta) => {
    const nuevosErrores = {};
    const fechaDesdeObj = new Date(desde);
    const fechaHastaObj = new Date(hasta);
    const fechaHoy = new Date(fechaActual);

    // Validar que no sean fechas pasadas
    if (desde && fechaDesdeObj < fechaHoy) {
      nuevosErrores.fechaDesde = "No se pueden seleccionar fechas anteriores a hoy";
    }

    if (hasta && fechaHastaObj < fechaHoy) {
      nuevosErrores.fechaHasta = "No se pueden seleccionar fechas anteriores a hoy";
    }

    // Validar que fecha hasta no sea menor que fecha desde
    if (desde && hasta && fechaHastaObj < fechaDesdeObj) {
      nuevosErrores.fechaHasta = "La fecha hasta debe ser posterior a la fecha desde";
    }

    return nuevosErrores;
  };

  const manejarCambioFechaDesde = (e) => {
    const nuevaFecha = e.target.value;
    setFechaDesde(nuevaFecha);
    
    // Si hay fecha hasta seleccionada, validar
    if (fechaHasta || nuevaFecha) {
      const erroresValidacion = validarFechas(nuevaFecha, fechaHasta);
      setErrores(erroresValidacion);
    }

    // Si la nueva fecha desde es posterior a fecha hasta, limpiar fecha hasta
    if (fechaHasta && nuevaFecha && new Date(nuevaFecha) > new Date(fechaHasta)) {
      setFechaHasta("");
    }
  };

  const manejarCambioFechaHasta = (e) => {
    const nuevaFecha = e.target.value;
    setFechaHasta(nuevaFecha);
    
    // Validar fechas
    const erroresValidacion = validarFechas(fechaDesde, nuevaFecha);
    setErrores(erroresValidacion);
  };

  const manejarBusqueda = () => {
    if (!fechaDesde || !fechaHasta) {
      setErrores({
        general: "Por favor selecciona ambas fechas"
      });
      return;
    }
    
    // Validar fechas antes de buscar
    const erroresValidacion = validarFechas(fechaDesde, fechaHasta);
    
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    // Limpiar errores
    setErrores({});
    setLoading(true);
    
    // Agregar al historial
    const nuevaBusqueda = {
      id: Date.now(),
      fechaDesde,
      fechaHasta,
      fecha: new Date().toLocaleDateString()
    };
    setHistorial(prev => [nuevaBusqueda, ...prev.slice(0, 4)]);
    
    // Simular búsqueda y obtener resultados
    setTimeout(() => {
      setLoading(false);
      
      // Aquí simularemos algunos resultados (en una app real vendrían de una API)
      const resultadosSimulados = [
        {
          id: 1,
          titulo: "Viaje a Playa del Carmen",
          fechaInicio: fechaDesde,
          fechaFin: fechaHasta,
          destino: "Quintana Roo, México",
          participantes: 8,
          estado: "confirmado",
          hora: "09:00",
          tipo: "Excursión"
        },
        {
          id: 2,
          titulo: "Tour Gastronómico Oaxaca",
          fechaInicio: fechaDesde,
          fechaFin: fechaDesde,
          destino: "Oaxaca de Juárez, Oaxaca",
          participantes: 12,
          estado: "pendiente",
          hora: "11:30",
          tipo: "Tour Gastronómico"
        },
        {
          id: 3,
          titulo: "Aventura en Chiapas",
          fechaInicio: fechaDesde,
          fechaFin: fechaHasta,
          destino: "San Cristóbal de las Casas, Chiapas",
          participantes: 15,
          estado: "confirmado",
          hora: "07:00",
          tipo: "Aventura"
        }
      ];
      
      setResultadosBusqueda(resultadosSimulados);
      setModalAbierto(true);
      
    }, 1500);
  };

  const manejarLimpiar = () => {
    setFechaDesde("");
    setFechaHasta("");
    setResultadosBusqueda([]);
    setErrores({});
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const tieneFechas = fechaDesde && fechaHasta;
  const tieneErrores = Object.keys(errores).length > 0;

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };

  const cargarBusquedaDelHistorial = (busqueda) => {
    setFechaDesde(busqueda.fechaDesde);
    setFechaHasta(busqueda.fechaHasta);
    setErrores({}); // Limpiar errores al cargar del historial
  };

  return (
    <>
      <div className="contenedor-buscador">
        <div className="tarjeta-buscador">
          
          {/* Línea principal con todos los elementos */}
          <div className="linea-principal">
            
            {/* Icono de calendario */}
            <div className="icono-principal">
              <Calendar size={24} />
            </div>

            {/* Campo Fecha Desde */}
            <div className="contenedor-campo">
              <div className="encabezado-campo">
                <label className="etiqueta-campo">FECHA DESDE</label>
                {fechaDesde && !errores.fechaDesde && <div className="indicador-activo"></div>}
              </div>
              <div className="contenedor-input">
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={manejarCambioFechaDesde}
                  className={`campo-fecha ${errores.fechaDesde ? 'campo-error' : ''}`}
                  min={fechaActual}
                  max={fechaHasta || undefined}
                />
                {fechaDesde && !errores.fechaDesde && (
                  <div className="fecha-mostrada">
                    {formatearFecha(fechaDesde)}
                  </div>
                )}
              </div>
              {errores.fechaDesde && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  <span>{errores.fechaDesde}</span>
                </div>
              )}
            </div>

            {/* Campo Fecha Hasta */}
            <div className="contenedor-campo">
              <div className="encabezado-campo">
                <label className="etiqueta-campo">FECHA HASTA</label>
                {fechaHasta && !errores.fechaHasta && <div className="indicador-activo"></div>}
              </div>
              <div className="contenedor-input">
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={manejarCambioFechaHasta}
                  className={`campo-fecha ${errores.fechaHasta ? 'campo-error' : ''}`}
                  min={fechaDesde || fechaActual}
                />
                {fechaHasta && !errores.fechaHasta && (
                  <div className="fecha-mostrada">
                    {formatearFecha(fechaHasta)}
                  </div>
                )}
              </div>
              {errores.fechaHasta && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  <span>{errores.fechaHasta}</span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="grupo-botones">
              <button 
                onClick={manejarLimpiar}
                className={`boton-limpiar ${tieneFechas ? 'activo' : 'deshabilitado'}`}
                disabled={!tieneFechas}
                title="Limpiar fechas"
              >
                <X size={16} />
              </button>

              <button 
                onClick={manejarBusqueda}
                className={`boton-buscar ${(tieneFechas && !tieneErrores) ? 'activo' : 'deshabilitado'}`}
                disabled={!tieneFechas || loading || tieneErrores}
                title="Buscar eventos"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

          </div>

          {/* Mensaje de error general */}
          {errores.general && (
            <div className="error-general">
              <AlertCircle size={16} />
              <span>{errores.general}</span>
            </div>
          )}

          {/* Indicador de estado */}
          <div className="contenedor-estado">
            {loading ? (
              <div className="estado-pendiente">
                <div className="icono-estado estado-amarillo"></div>
                <span>Buscando eventos...</span>
              </div>
            ) : tieneErrores ? (
              <div className="estado-error">
                <div className="icono-estado estado-rojo"></div>
                <span>Corrige los errores para continuar</span>
              </div>
            ) : tieneFechas ? (
              <div className="estado-listo">
                <div className="icono-estado estado-verde"></div>
                <span>Fechas seleccionadas - Listo para buscar</span>
              </div>
            ) : (
              <div className="estado-pendiente">
                <div className="icono-estado estado-amarillo"></div>
                <span>
                  {!fechaDesde && !fechaHasta ? 'Selecciona las fechas de búsqueda' : 
                   !fechaDesde ? 'Selecciona la fecha desde' : 'Selecciona la fecha hasta'}
                </span>
              </div>
            )}
          </div>

          {/* Historial de búsquedas */}
          {historial.length > 0 && (
            <div className="historial-container">
              <div className="historial-titulo">
                <History size={16} />
                <span>Búsquedas recientes</span>
              </div>
              <div className="historial-lista">
                {historial.slice(0, 3).map((busqueda) => (
                  <button
                    key={busqueda.id}
                    className="historial-item"
                    onClick={() => cargarBusquedaDelHistorial(busqueda)}
                  >
                    <span>{formatearFecha(busqueda.fechaDesde)} - {formatearFecha(busqueda.fechaHasta)}</span>
                    <small>{busqueda.fecha}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Resultados */}
      <ModalResultadosFechas
        isOpen={modalAbierto}
        onClose={cerrarModal}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        resultados={resultadosBusqueda}
      />
    </>
  );
};

export default BuscadorFecha;