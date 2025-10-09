import { useState } from 'react';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaVehiculos from './Componentes/TablaVehiculos';
import ModalVehiculo from './ModalesVehiculos/ModalVehiculo';
import ModalEditarVehiculo from './ModalesVehiculos/ModalEditarVehiculo';
import ModalVerVehiculo from './ModalesVehiculos/ModalVerVehiculo';
import ModalEliminarVehiculo from './ModalesVehiculos/ModalEliminarVehiculo';
import './VehiculosPrincipal.css';

const VehiculosPrincipal = () => {
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
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

  const handleEliminarVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalEliminarAbierto(true);
  };

  const handleGuardarNuevoVehiculo = (vehiculo) => {
    // Aquí iría la lógica para guardar en la API
    console.log('Guardar nuevo vehículo:', vehiculo);
    setModalAgregarAbierto(false);
  };

  const handleActualizarVehiculo = (vehiculoActualizado) => {
    // Aquí iría la lógica para actualizar en la API
    console.log('Actualizar vehículo:', vehiculoActualizado);
    setModalEditarAbierto(false);
    setVehiculoSeleccionado(null);
  };

  const handleConfirmarEliminar = () => {
    // Aquí iría la lógica para eliminar en la API
    console.log('Eliminar vehículo:', vehiculoSeleccionado);
    setModalEliminarAbierto(false);
    setVehiculoSeleccionado(null);
  };

  return (
    <PrincipalComponente>
      <div className="vehiculos-principal">
        <TablaVehiculos
          onVer={handleVerVehiculo}
          onEditar={handleEditarVehiculo}
          onEliminar={handleEliminarVehiculo}
          onAgregar={handleAgregarVehiculo}
        />

        {/* Modal para AGREGAR nuevo vehículo */}
        {modalAgregarAbierto && (
          <ModalVehiculo
            onGuardar={handleGuardarNuevoVehiculo}
            onCerrar={() => setModalAgregarAbierto(false)}
          />
        )}

        {/* Modal para EDITAR vehículo existente */}
        {modalEditarAbierto && (
          <ModalEditarVehiculo
            vehiculo={vehiculoSeleccionado}
            onGuardar={handleActualizarVehiculo}
            onCerrar={() => {
              setModalEditarAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}

        {/* Modal para VER detalles del vehículo */}
        {modalVerAbierto && (
          <ModalVerVehiculo
            vehiculo={vehiculoSeleccionado}
            onCerrar={() => {
              setModalVerAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}

        {/* Modal para ELIMINAR vehículo */}
        {modalEliminarAbierto && (
          <ModalEliminarVehiculo
            vehiculo={vehiculoSeleccionado}
            onConfirmar={handleConfirmarEliminar}
            onCerrar={() => {
              setModalEliminarAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default VehiculosPrincipal;