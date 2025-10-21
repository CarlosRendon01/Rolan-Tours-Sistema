import { useState } from 'react';
import { useVehiculos } from './VehiculosContext';
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
    const confirmado = await modalEliminarVehiculo(vehiculo, async (vehiculoAEliminar) => {
      await eliminarVehiculo(vehiculoAEliminar.id);
      console.log('✅ Vehículo eliminado exitosamente:', vehiculoAEliminar.nombre);
    });
  };

  // Esta función NO cierra el modal, lo hace el ModalVehiculo después de la alerta
  const handleGuardarNuevoVehiculo = async (vehiculo) => {
    await agregarVehiculo(vehiculo);
  };

  const handleActualizarVehiculo = (vehiculoActualizado) => {
    actualizarVehiculo(vehiculoActualizado);
    setModalEditarAbierto(false);
    setVehiculoSeleccionado(null);
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