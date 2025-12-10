import React, { useState } from "react";
import axios from "axios";
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

  const manejarBusqueda = async () => {
    if (!fechaDesde || !fechaHasta) {
      setErrores({
        general: "Por favor selecciona ambas fechas"
      });
      return;
    }

    const erroresValidacion = validarFechas(fechaDesde, fechaHasta);

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setErrores({});
    setLoading(true);

    const nuevaBusqueda = {
      id: Date.now(),
      fechaDesde,
      fechaHasta,
      fecha: new Date().toLocaleDateString()
    };
    setHistorial(prev => [nuevaBusqueda, ...prev.slice(0, 4)]);

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(
        'http://127.0.0.1:8000/api/ordenes-servicio/filtrar/rango-fechas',
        {
          params: {
            fecha_inicio: fechaDesde,
            fecha_fin: fechaHasta
          }
        }
      );

      console.log('🔍 Resultados de búsqueda:', response.data);

      // ✅ Transformar órdenes a formato de resultados
      const resultados = response.data.map(orden => ({
        id: orden.id,
        titulo: `${orden.destino || 'Sin destino'} - ${orden.nombre_cliente || 'Sin cliente'}`,
        fechaInicio: orden.fecha_inicio_servicio ? orden.fecha_inicio_servicio.split('T')[0] : fechaDesde,
        fechaFin: orden.fecha_final_servicio ? orden.fecha_final_servicio.split('T')[0] : fechaHasta,
        destino: orden.destino || 'Sin destino',
        participantes: orden.numero_pasajeros || 0,
        disponibles: Math.max(0, 10 - (orden.numero_pasajeros || 0)),
        estado: orden.activo ? "confirmado" : "cancelado",
        hora: orden.horario_inicio_servicio || "09:00",
        duracion: calcularDuracion(orden.horario_inicio_servicio, orden.horario_final_servicio),
        tipo: determinarTipo(orden.destino),
        descripcion: orden.itinerario_detallado || `Servicio de ${orden.ciudad_origen} a ${orden.destino}`,
        precio: "$850.00",
        puntuacion: 4.5
      }));

      console.log('✅ Resultados transformados:', resultados);

      setResultadosBusqueda(resultados);
      setModalAbierto(true);
    } catch (error) {
      console.error('Error al buscar órdenes:', error);
      setErrores({
        general: "Error al buscar. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularDuracion = (inicio, fin) => {
    if (!inicio || !fin) return "Duración no especificada";

    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);

    const minutosInicio = horaInicio * 60 + minInicio;
    const minutosFin = horaFin * 60 + minFin;
    const diferencia = minutosFin - minutosInicio;

    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;

    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };

  const determinarTipo = (destino) => {
    const destinoLower = (destino || '').toLowerCase();
    const palabrasTour = ['tour', 'monte albán', 'hierve', 'mitla', 'teotitlán'];

    return palabrasTour.some(palabra => destinoLower.includes(palabra)) ? 'Tour' : 'Traslado';
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
    setErrores({});
  };

  const eliminarDelHistorial = (id, e) => {
    e.stopPropagation(); 
    setHistorial(prev => prev.filter(item => item.id !== id));
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
                  <div
                    key={busqueda.id}
                    className="historial-item"
                    onClick={() => cargarBusquedaDelHistorial(busqueda)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        cargarBusquedaDelHistorial(busqueda);
                      }
                    }}
                  >
                    <span className="historial-fechas">
                      {formatearFecha(busqueda.fechaDesde)} - {formatearFecha(busqueda.fechaHasta)}
                    </span>
                    <div className="historial-acciones">
                      <small className="historial-fecha-busqueda">{busqueda.fecha}</small>
                      <button
                        className="boton-eliminar-historial"
                        onClick={(e) => eliminarDelHistorial(busqueda.id, e)}
                        title="Eliminar del historial"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
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