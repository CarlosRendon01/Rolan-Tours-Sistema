import React, { useState } from "react";
import PrincipalComponente from "../Generales/componentes/PrincipalComponente"; // ← AGREGAR
import { useVehiculos } from "../Operaciones/Vehiculos/VehiculosContext";
import CardVehiculo from "./Componentes/CardVehiculo";
import ModalMantenimiento from "./ModalesMantenimiento/ModalMantenimiento";
import ModalRegistrarMantenimiento from "./ModalesMantenimiento/Modalregistrarmantenimiento";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import "./MantenimientoPrincipal.css";

const MantenimientoPrincipal = () => {
  const {
    vehiculos,
    mantenimientos,
    obtenerMantenimiento,
    registrarMantenimiento,
    actualizarMantenimiento,
    obtenerEstadisticas,
  } = useVehiculos();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, verde, amarillo, rojo
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalRegistrarAbierto, setModalRegistrarAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // Obtener estadísticas
  const estadisticas = obtenerEstadisticas();

  // Filtrar vehículos
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const mantenimiento = obtenerMantenimiento(vehiculo.id);
    if (!mantenimiento) return false;

    // Filtro de búsqueda
    const cumpleBusqueda =
      vehiculo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.numero_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro de estado
    const cumpleEstado =
      filtroEstado === "todos" || mantenimiento.estado === filtroEstado;

    return cumpleBusqueda && cumpleEstado;
  });

  // Abrir modal de detalles
  const handleVerDetalles = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(true);
  };

  // Abrir modal de registrar mantenimiento
  const handleRegistrarMantenimiento = (vehiculoId) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(false);
    setModalRegistrarAbierto(true);
  };

  // Guardar nuevo mantenimiento
  const handleGuardarMantenimiento = async (vehiculoId, nuevoMantenimiento) => {
    await registrarMantenimiento(vehiculoId, nuevoMantenimiento);
  };

  // Actualizar kilometraje
  const handleActualizarKilometraje = (vehiculoId, nuevoKm) => {
    actualizarMantenimiento(vehiculoId, {
      kilometraje_actual: nuevoKm,
    });
  };

  return (
    <PrincipalComponente>
      <div className="mantenimiento-principal">
        {/* Header con estadísticas */}
        <div className="mantenimiento-encabezado">
          <div className="mantenimiento-seccion-logo">
            <div className="mantenimiento-lineas-decorativas">
              <div className="mantenimiento-linea mantenimiento-azul"></div>
              <div className="mantenimiento-linea mantenimiento-verde"></div>
              <div className="mantenimiento-linea mantenimiento-amarilla"></div>
              <div className="mantenimiento-linea mantenimiento-roja"></div>
            </div>
            <h1 className="mantenimiento-titulo">Control de Mantenimiento</h1>
          </div>

          {/* Estadísticas */}
          <div className="mantenimiento-contenedor-estadisticas">
            <div className="mantenimiento-estadistica">
              <div className="mantenimiento-icono-estadistica total">
                <Wrench size={20} />
              </div>
              <div className="mantenimiento-info-estadistica">
                <span className="mantenimiento-numero">
                  {estadisticas.total}
                </span>
                <span className="mantenimiento-label">Total</span>
              </div>
            </div>

            <div className="mantenimiento-estadistica">
              <div className="mantenimiento-icono-estadistica verde">
                <CheckCircle size={20} />
              </div>
              <div className="mantenimiento-info-estadistica">
                <span className="mantenimiento-numero">
                  {estadisticas.verde}
                </span>
                <span className="mantenimiento-label">En buen estado</span>
              </div>
            </div>

            <div className="mantenimiento-estadistica">
              <div className="mantenimiento-icono-estadistica amarillo">
                <Clock size={20} />
              </div>
              <div className="mantenimiento-info-estadistica">
                <span className="mantenimiento-numero">
                  {estadisticas.amarillo}
                </span>
                <span className="mantenimiento-label">Próximo</span>
              </div>
            </div>

            <div className="mantenimiento-estadistica">
              <div className="mantenimiento-icono-estadistica rojo">
                <AlertTriangle size={20} />
              </div>
              <div className="mantenimiento-info-estadistica">
                <span className="mantenimiento-numero">
                  {estadisticas.rojo}
                </span>
                <span className="mantenimiento-label">Urgente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="mantenimiento-controles">
          {/* Búsqueda */}
          <div className="mantenimiento-control-busqueda">
            <div className="mantenimiento-entrada-busqueda">
              <Search className="mantenimiento-icono-buscar" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, placa, marca o modelo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mantenimiento-entrada-buscar"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="mantenimiento-filtros">
            <Filter size={18} />
            <button
              className={`mantenimiento-btn-filtro ${
                filtroEstado === "todos" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("todos")}
            >
              Todos ({estadisticas.total})
            </button>
            <button
              className={`mantenimiento-btn-filtro verde ${
                filtroEstado === "verde" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("verde")}
            >
              <CheckCircle size={16} />
              Buen estado ({estadisticas.verde})
            </button>
            <button
              className={`mantenimiento-btn-filtro amarillo ${
                filtroEstado === "amarillo" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("amarillo")}
            >
              <Clock size={16} />
              Próximo ({estadisticas.amarillo})
            </button>
            <button
              className={`mantenimiento-btn-filtro rojo ${
                filtroEstado === "rojo" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("rojo")}
            >
              <AlertTriangle size={16} />
              Urgente ({estadisticas.rojo})
            </button>
          </div>
        </div>

        {/* Grid de cards */}
        {vehiculosFiltrados.length === 0 ? (
          <div className="mantenimiento-vacio">
            <Wrench size={80} strokeWidth={1.5} />
            <p className="mantenimiento-mensaje-vacio">
              {busqueda || filtroEstado !== "todos"
                ? "No se encontraron vehículos con los filtros aplicados"
                : "No hay vehículos registrados en el sistema"}
            </p>
          </div>
        ) : (
          <div className="mantenimiento-grid">
            {vehiculosFiltrados.map((vehiculo) => {
              const mantenimiento = obtenerMantenimiento(vehiculo.id);
              return (
                <CardVehiculo
                  key={vehiculo.id}
                  vehiculo={vehiculo}
                  mantenimiento={mantenimiento}
                  onClick={() => handleVerDetalles(vehiculo)}
                />
              );
            })}
          </div>
        )}

        {/* Modal de detalles */}
        {modalDetallesAbierto && vehiculoSeleccionado && (
          <ModalMantenimiento
            vehiculo={vehiculoSeleccionado}
            mantenimiento={obtenerMantenimiento(vehiculoSeleccionado.id)}
            onCerrar={() => {
              setModalDetallesAbierto(false);
              setVehiculoSeleccionado(null);
            }}
            onRegistrarMantenimiento={handleRegistrarMantenimiento}
            onActualizarKilometraje={handleActualizarKilometraje}
          />
        )}

        {/* Modal de registrar mantenimiento */}
        {modalRegistrarAbierto && vehiculoSeleccionado && (
          <ModalRegistrarMantenimiento
            vehiculo={vehiculoSeleccionado}
            mantenimiento={obtenerMantenimiento(vehiculoSeleccionado.id)}
            onGuardar={handleGuardarMantenimiento}
            onCerrar={() => {
              setModalRegistrarAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default MantenimientoPrincipal;
