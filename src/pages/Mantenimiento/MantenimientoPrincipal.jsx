import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../Generales/Componentes/PrincipalComponente";
import CardVehiculo from "../Componentes/CardVehiculo";
import ModalMantenimiento from "./ModalRegistrarMantenimiento";
import ModalRegistrarMantenimiento from "../ModalesMantenimiento/ModalRegistrarMantenimiento";
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
  const [keyModal, setKeyModal] = useState(0);
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
    } catch (error) {
      console.error('❌ Error al cargar vehículos:', error);
    }
  };

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
      setVehiculos(prev =>
        prev.map(v => v.id === vehiculoId ? vehiculoActualizado : v)
      );

      if (vehiculoSeleccionado?.id === vehiculoId) {
        setVehiculoSeleccionado(vehiculoActualizado);
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

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const estado = vehiculo.estado_mantenimiento || 'verde';
    const cumpleBusqueda =
      vehiculo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.numero_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleEstado = filtroEstado === "todos" || estado === filtroEstado;
    return cumpleBusqueda && cumpleEstado;
  });

  const handleVerDetalles = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(true);
  };

  const handleRegistrarMantenimiento = (vehiculoId) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    setVehiculoSeleccionado(vehiculo);
    setModalDetallesAbierto(false);
    setModalRegistrarAbierto(true);
  };

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


      await recargarVehiculoEspecifico(vehiculoId);
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
      await recargarVehiculoEspecifico(vehiculoId);
    } catch (error) {
      console.error("❌ Error al actualizar kilometraje:", error);
      throw error;
    }
  };

  return (
    <PrincipalComponente>
      <div className="mantenimiento-principal">
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

        <div className="mantenimiento-controles">
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