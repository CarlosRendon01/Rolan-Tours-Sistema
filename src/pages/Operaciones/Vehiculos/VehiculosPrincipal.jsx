import { useState, useEffect } from 'react';
import axios from 'axios';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaVehiculos from './Componentes/TablaVehiculos';
import ModalVehiculo from './ModalesVehiculos/ModalVehiculo';
import ModalEditarVehiculo from './ModalesVehiculos/ModalEditarVehiculo';
import ModalVerVehiculo from './ModalesVehiculos/ModalVerVehiculo';
import { modalEliminarVehiculo } from './ModalesVehiculos/ModalEliminarVehiculo';
import './VehiculosPrincipal.css';

const VehiculosPrincipal = () => {
  // Obtener funciones y estado del Context
  const {
    vehiculos,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
  } = useVehiculos();

  // Estados de los modales
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

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
      console.log('✅ Vehículos cargados:', response.data);
    } catch (error) {
      console.error('❌ Error al cargar vehículos:', error);
    }
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    recargarVehiculos();
  }, []);

  const handleAgregarVehiculo = () => {
    setModalAgregarAbierto(true);
  };

  const handleVerVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalVerAbierto(true);
  };

  const handleEditarVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalEditarAbierto(true);
  };

  const handleEliminarVehiculo = async (vehiculo) => {
    const confirmado = await modalEliminarVehiculo(vehiculo, await recargarVehiculos)
    if (confirmado) {
      console.log('Vehículo eliminado:', vehiculo);
    }
  };

  // Esta función NO cierra el modal, lo hace el ModalVehiculo después de la alerta
  const handleGuardarNuevoVehiculo = async (vehiculo) => {
    try {
      const token = localStorage.getItem("token");

      const vehiculoData = {
        nombre: vehiculo.nombre,
        rendimiento: parseFloat(vehiculo.rendimiento),
        precio_combustible: parseFloat(vehiculo.precio_combustible),
        desgaste: parseFloat(vehiculo.desgaste),
        costo_renta: parseFloat(vehiculo.costo_renta),
        costo_chofer_dia: parseFloat(vehiculo.costo_chofer_dia),
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: parseInt(vehiculo.anio),
        numero_placa: vehiculo.numero_placa,
        numero_pasajeros: parseInt(vehiculo.numero_pasajeros),
        vehiculos_disponibles: parseInt(vehiculo.vehiculos_disponibles),
        numero_serie: vehiculo.numero_serie || null,
        nip: vehiculo.nip || null,
        numero_tag: vehiculo.numero_tag || null,
        numero_combustible: vehiculo.numero_combustible || null,
        color: vehiculo.color || null,
        comentarios: vehiculo.comentarios || null,
      };

      console.log("📦 Datos a enviar al backend:", vehiculoData);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/vehiculos",
        vehiculoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log("✅ Vehiculo creado:", response.data);
      await recargarVehiculos(); // Recargar la lista
      return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
    } catch (error) {
      console.error("❌ Error al crear vehiculo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      throw error; // ✅ Lanzar el error para que el modal lo maneje
    }
  };

  const handleActualizarVehiculo = async (vehiculoActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const vehiculoData = {
        nombre: vehiculoActualizado.nombre,
        rendimiento: parseFloat(vehiculoActualizado.rendimiento),
        precio_combustible: parseFloat(vehiculoActualizado.precio_combustible),
        desgaste: parseFloat(vehiculoActualizado.desgaste),
        costo_renta: parseFloat(vehiculoActualizado.costo_renta),
        costo_chofer_dia: parseFloat(vehiculoActualizado.costo_chofer_dia),
        marca: vehiculoActualizado.marca,
        modelo: vehiculoActualizado.modelo,
        anio: parseInt(vehiculoActualizado.anio),
        numero_placa: vehiculoActualizado.numero_placa,
        numero_pasajeros: parseInt(vehiculoActualizado.numero_pasajeros),
        vehiculos_disponibles: parseInt(vehiculoActualizado.vehiculos_disponibles),
        numero_serie: vehiculoActualizado.numero_serie || null,
        nip: vehiculoActualizado.nip || null,
        numero_tag: vehiculoActualizado.numero_tag || null,
        numero_combustible: vehiculoActualizado.numero_combustible || null,
        color: vehiculoActualizado.color || null,
        comentarios: vehiculoActualizado.comentarios || null,
      };

      console.log("📦 Datos a actualizar:", vehiculoData);

      const response = await axios.put(
        `http://127.0.0.1:8000/api/vehiculos/${vehiculoActualizado.id}`,
        vehiculoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log("✅ Vehiculo actualizado:", response.data);
      await recargarVehiculos(); // Recargar la lista
      return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
    } catch (error) {
      console.error("❌ Error al actualizar vehiculo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      throw error; // ✅ Lanzar el error para que el modal lo maneje
    }
  };

  const handleCerrarModalAgregar = () => {
    setModalAgregarAbierto(false);
  };

  return (
    <PrincipalComponente>
      <div className="vehiculos-principal">
        <TablaVehiculos
          vehiculos={vehiculos}
          onVer={handleVerVehiculo}
          onEditar={handleEditarVehiculo}
          onEliminar={handleEliminarVehiculo}
          onAgregar={handleAgregarVehiculo}
        />

        {/* Modal AGREGAR */}
        {modalAgregarAbierto && (
          <ModalVehiculo
            onGuardar={handleGuardarNuevoVehiculo}
            onCerrar={handleCerrarModalAgregar}
          />
        )}

        {/* Modal EDITAR */}
        {modalEditarAbierto && vehiculoSeleccionado && (
          <ModalEditarVehiculo
            vehiculo={vehiculoSeleccionado}
            onGuardar={handleActualizarVehiculo}
            onCerrar={() => {
              setModalEditarAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}

        {/* Modal VER */}
        {modalVerAbierto && vehiculoSeleccionado && (
          <ModalVerVehiculo
            vehiculo={vehiculoSeleccionado}
            onCerrar={() => {
              setModalVerAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default VehiculosPrincipal;