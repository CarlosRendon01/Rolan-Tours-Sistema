import React, { useState } from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaTransporte from "./Componentes/TablaTransporte";
import ModalAgregarTransporte from "./ModalesTransporte/ModalAgregarTransporte";
import ModalEditarTransporte from "./ModalesTransporte/ModalEditarTransporte";
import ModalVerTransporte from "./ModalesTransporte/ModalVerTransporte";
import { modalEliminarTransporte } from "./ModalesTransporte/Modaleliminartransporte"; 
import "./TransportePrincipal.css";

const TransportePrincipal = () => {
  // Estado principal
  const [transportes, setTransportes] = useState([
    {
      id: 1,
      codigo_servicio: "TRANS-VAN-001",
      nombre_servicio: "Traslado Aeropuerto - Hotel Zona Centro",
      tipo_transporte: "Van",
      capacidad: 8,
      descripcion_servicio:
        "Servicio de traslado privado desde el aeropuerto internacional hasta hoteles en la zona centro de la ciudad. Incluye conductor profesional, vehículo climatizado, agua embotellada y asistencia con equipaje.",
      tipo_paquete: "Por viaje",
      duracion_paquete: "Viaje sencillo",
      precio_base: 450.0,
      moneda: "MXN",
      incluye:
        "Conductor, combustible, agua embotellada, asistencia con equipaje, seguro de viajero",
      restricciones:
        "Máximo 8 pasajeros, equipaje estándar (1 maleta grande y 1 carry-on por persona)",
      empresa_proveedora_id: 1,
      nombre_proveedor: "Transportes Turísticos del Valle",
      ubicacion_salida: "Aeropuerto Internacional",
      ubicacion_destino: "Zona Centro",
      disponibilidad: true,
      foto_servicio: "https://example.com/van-service.jpg",
      estado: "Activo",
      fecha_registro: "2025-01-15",
    },
    {
      id: 2,
      codigo_servicio: "TRANS-BUS-002",
      nombre_servicio: "Tour Completo Zonas Arqueológicas",
      tipo_transporte: "Autobús",
      capacidad: 45,
      descripcion_servicio:
        "Servicio de transporte en autobús de lujo para recorrido completo por las principales zonas arqueológicas de la región. Incluye guía certificado, conductor experimentado, aire acondicionado, asientos reclinables, sistema de audio y pantallas individuales.",
      tipo_paquete: "Por día",
      duracion_paquete: "8 horas",
      precio_base: 3500.0,
      moneda: "MXN",
      incluye:
        "Conductor, guía certificado, combustible, peajes, estacionamientos, agua y snacks, seguro de viajero, sistema de audio/video",
      restricciones:
        "Mínimo 20 pasajeros para confirmar servicio, salida 7:00 AM puntual, no permite mascotas, prohibido fumar",
      empresa_proveedora_id: 2,
      nombre_proveedor: "Autobuses Turismo Premium",
      ubicacion_salida: "Plaza Principal",
      ubicacion_destino: "Ruta Arqueológica",
      disponibilidad: true,
      foto_servicio: "https://example.com/bus-tour.jpg",
      estado: "Activo",
      fecha_registro: "2025-02-01",
    },
  ]);

  // Estados para los modales
  const [transporteSeleccionado, setTransporteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  // Lista de proveedores
  const proveedores = [
    { id: 1, nombre: "Transportes Turísticos del Valle" },
    { id: 2, nombre: "Autobuses Turismo Premium" },
    { id: 3, nombre: "Viajes Ejecutivos SA" },
    { id: 4, nombre: "Transportes Regionales" },
  ];

  // Manejadores
  const manejarVer = (transporte) => {
    setTransporteSeleccionado(transporte);
    setModalVerAbierto(true);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const manejarEditar = (transporte) => {
    setTransporteSeleccionado(transporte);
    setModalEditarAbierto(true);
  };

  const manejarGuardarTransporte = (nuevoTransporte) => {
    const transporteConId = {
      ...nuevoTransporte,
      id: Date.now(),
      fecha_registro: new Date().toISOString().split("T")[0],
    };

    setTransportes([...transportes, transporteConId]);
    cerrarModales();
    console.log("Transporte agregado:", transporteConId);
  };

  const manejarActualizarTransporte = (transporteActualizado) => {
    setTransportes(
      transportes.map((t) =>
        t.id === transporteActualizado.id ? transporteActualizado : t
      )
    );
    cerrarModales();
    console.log("Transporte actualizado:", transporteActualizado);
  };

  // ✅ NUEVA FUNCIÓN PARA ELIMINAR
  const manejarEliminar = async (transporte) => {
    const confirmado = await modalEliminarTransporte(
      transporte,
      async (transporteAEliminar) => {
        // Aquí puedes agregar la lógica de eliminación del backend
        // Por ejemplo: await eliminarTransporteAPI(transporteAEliminar.id);
        
        // Eliminar del estado local
        setTransportes(
          transportes.filter((t) => t.id !== transporteAEliminar.id)
        );
      }
    );

    if (confirmado) {
      console.log("Transporte eliminado:", transporte);
    }
  };

  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalAgregarAbierto(false);
    setModalEditarAbierto(false);
    setTransporteSeleccionado(null);
  };

  return (
    <PrincipalComponente>
      <div className="transporte-principal">
        <TablaTransporte
          transportes={transportes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}  
        />

        {/* Modal Ver */}
        {modalVerAbierto && transporteSeleccionado && (
          <ModalVerTransporte
            transporte={transporteSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

        {/* Modal Agregar */}
        {modalAgregarAbierto && (
          <ModalAgregarTransporte
            onGuardar={manejarGuardarTransporte}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Editar */}
        {modalEditarAbierto && transporteSeleccionado && (
          <ModalEditarTransporte
            transporte={transporteSeleccionado}
            onGuardar={manejarActualizarTransporte}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default TransportePrincipal;