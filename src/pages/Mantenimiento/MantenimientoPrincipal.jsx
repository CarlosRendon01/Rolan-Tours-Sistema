import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../Generales/componentes/PrincipalComponente";
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
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalRegistrarAbierto, setModalRegistrarAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // ✅ NUEVO: Estado para forzar re-render del modal
  const [keyModal, setKeyModal] = useState(0);

  // ✅ Cargar vehículos con datos de mantenimiento
  const recargarVehiculos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/vehiculos", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setVehiculos(response.data);
      console.log('✅ Vehículos cargados con datos de mantenimiento:', response.data);
    } catch (error) {
      console.error('❌ Error al cargar vehículos:', error);
    }
  };

  // ✅ Recargar un vehículo específico
  const recargarVehiculoEspecifico = async (vehiculoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://127.0.0.1:8000/api/vehiculos/${vehiculoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      const vehiculoActualizado = response.data;

      console.log('✅ Vehículo recargado:', {
        id: vehiculoActualizado.id,
        nombre: vehiculoActualizado.nombre,
        kilometraje_actual: vehiculoActualizado.kilometraje_actual,
        estado_mantenimiento: vehiculoActualizado.estado_mantenimiento,
        ultimo_mantenimiento: vehiculoActualizado.ultimo_mantenimiento,
        total_mantenimientos: vehiculoActualizado.mantenimientos?.length || 0,
      });

      // ✅ Actualizar el vehículo en la lista
      setVehiculos(prev =>
        prev.map(v => v.id === vehiculoId ? vehiculoActualizado : v)
      );

      // ✅ IMPORTANTE: Actualizar el vehículo seleccionado para el modal
      if (vehiculoSeleccionado?.id === vehiculoId) {
        setVehiculoSeleccionado(vehiculoActualizado);
        // ✅ Forzar re-render del modal
        setKeyModal(prev => prev + 1);
      }

      return vehiculoActualizado;
    } catch (error) {
      console.error('❌ Error al recargar vehículo específico:', error);
      throw error;
    }
  };

  useEffect(() => {
    recargarVehiculos();
  }, []);

  // ✅ Obtener estadísticas
  const obtenerEstadisticas = () => {
    const stats = {
      total: vehiculos.length,
      verde: 0,
      amarillo: 0,
      rojo: 0,
    };

    vehiculos.forEach(vehiculo => {
      const estado = vehiculo.estado_mantenimiento || 'verde';
      if (stats[estado] !== undefined) {
        stats[estado]++;
      }
    });

    return stats;
  };

  const estadisticas = obtenerEstadisticas();

  // ✅ Obtener datos de mantenimiento de un vehículo
  const obtenerMantenimiento = (vehiculo) => {
    return {
      kilometraje_actual: vehiculo.kilometraje_actual || 0,
      estado: vehiculo.estado_mantenimiento || 'verde',
      ultimo_mantenimiento: vehiculo.ultimo_mantenimiento || null,
      historial: vehiculo.mantenimientos || [],
      intervalo_km: 5000, // Configurable
      proximo_mantenimiento: null,
    };
  };

  // ✅ Filtrar vehículos
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const estado = vehiculo.estado_mantenimiento || 'verde';

    // Filtro de búsqueda
    const cumpleBusqueda =
      vehiculo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.numero_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro de estado
    const cumpleEstado = filtroEstado === "todos" || estado === filtroEstado;

    return cumpleBusqueda && cumpleEstado;
  });

  // ✅ Abrir modal de detalles
  const handleVerDetalles = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(true);
  };

  // ✅ Abrir modal de registrar mantenimiento
  const handleRegistrarMantenimiento = (vehiculoId) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(false);
    setModalRegistrarAbierto(true);
  };

  // ✅ MODIFICADO: Guardar nuevo mantenimiento
  const handleGuardarMantenimiento = async (vehiculoId, nuevoMantenimiento) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append('vehiculo_id', vehiculoId);
      formData.append('tipo', nuevoMantenimiento.tipo);
      formData.append('kilometraje', nuevoMantenimiento.kilometraje);
      formData.append('descripcion', nuevoMantenimiento.descripcion);
      formData.append('fecha', nuevoMantenimiento.fecha);

      if (nuevoMantenimiento.costo) {
        formData.append('costo', nuevoMantenimiento.costo);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/mantenimientos",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("✅ Mantenimiento registrado:", response.data);

      // ✅ Recargar el vehículo específico (actualiza modal automáticamente)
      await recargarVehiculoEspecifico(vehiculoId);

      // ✅ Reabrir el modal de detalles después de cerrar el de registro
      setModalRegistrarAbierto(false);
      setTimeout(() => {
        setModalDetallesAbierto(true);
      }, 100);

      return response.data;
    } catch (error) {
      console.error("❌ Error al registrar mantenimiento:", error);
      throw error;
    }
  };

  // ✅ MODIFICADO: Actualizar kilometraje
  const handleActualizarKilometraje = async (vehiculoId, nuevoKm) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append('vehiculo_id', vehiculoId);
      formData.append('tipo', 'Actualización de Kilometraje');
      formData.append('kilometraje', nuevoKm);
      formData.append('descripcion', 'Actualización manual de kilometraje');
      formData.append('fecha', new Date().toISOString().split('T')[0]);

      await axios.post(
        "http://127.0.0.1:8000/api/mantenimientos",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("✅ Kilometraje actualizado");

      // ✅ Recargar el vehículo específico (actualiza modal automáticamente)
      await recargarVehiculoEspecifico(vehiculoId);

    } catch (error) {
      console.error("❌ Error al actualizar kilometraje:", error);
      throw error;
    }
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
              className={`mantenimiento-btn-filtro ${filtroEstado === "todos" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("todos")}
            >
              Todos ({estadisticas.total})
            </button>
            <button
              className={`mantenimiento-btn-filtro verde ${filtroEstado === "verde" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("verde")}
            >
              <CheckCircle size={16} />
              Buen estado ({estadisticas.verde})
            </button>
            <button
              className={`mantenimiento-btn-filtro amarillo ${filtroEstado === "amarillo" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("amarillo")}
            >
              <Clock size={16} />
              Próximo ({estadisticas.amarillo})
            </button>
            <button
              className={`mantenimiento-btn-filtro rojo ${filtroEstado === "rojo" ? "active" : ""
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
              const mantenimiento = obtenerMantenimiento(vehiculo);
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

        {/* Modal de detalles - ✅ AGREGADO key para forzar re-render */}
        {modalDetallesAbierto && vehiculoSeleccionado && (
          <ModalMantenimiento
            key={`modal-${vehiculoSeleccionado.id}-${keyModal}`}
            vehiculo={vehiculoSeleccionado}
            mantenimiento={obtenerMantenimiento(vehiculoSeleccionado)}
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
            mantenimiento={obtenerMantenimiento(vehiculoSeleccionado)}
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