import React, { useState } from "react";
import TablaProveedores from "./Componentes/TablaProveedores";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import ModalAgregarProveedor from "./ModalesProveedores/ModalAgregarProovedor";
import ModalVerProveedor from "./ModalesProveedores/ModalVerProveedor";
import ModalEditarProveedor from "./ModalesProveedores/ModalEditarProveedor";
import { modalEliminarProveedor } from "./ModalesProveedores/ModalEliminarProveedor";
import "./ProveedoresPrincipal.css";

// Importar otros modales cuando los crees:
// import ModalVerProveedor from './ModalesProveedores/ModalVerProveedor';
// import ModalEditarProveedor from './ModalesProveedores/ModalEditarProveedor';
// import { modalEliminarProveedor } from './ModalesProveedores/ModalEliminarProveedor';

const ProveedoresPrincipal = () => {
  // Estado para almacenar los proveedores
  const [proveedores, setProveedores] = useState([
    {
      id_proveedor: 1,
      nombre_razon_social: "Transportes del Pacífico S.A. de C.V.",
      tipo_proveedor: "Transporte",
      rfc: "TPA920315KL8",
      descripcion_servicio: "Transporte de carga pesada y mercancías",
      metodo_pago: "Transferencia",
      nombre_contacto: "Roberto Martínez García",
      telefono: "5551234567",
      correo: "contacto@transportespacifico.com.mx",
      direccion: "Av. Insurgentes Sur 1234",
      ciudad: "Ciudad de México",
      entidad_federativa: "Ciudad de México",
      pais: "México",
      documento_rfc: "rfc_transportespacifico.pdf",
      identificacion: "ine_roberto.pdf",
      foto_proveedor: null,
      estado: "activo",
    },
    {
      id_proveedor: 2,
      nombre_razon_social: "Hotel Ejecutivo Plaza",
      tipo_proveedor: "Hospedaje",
      rfc: "HEP880620MN9",
      descripcion_servicio: "Servicios de hospedaje y alojamiento",
      metodo_pago: "Transferencia",
      nombre_contacto: "Ana Patricia López",
      telefono: "5552345678",
      correo: "reservaciones@hotelplaza.com",
      direccion: "Boulevard Adolfo López Mateos 567",
      ciudad: "Guadalajara",
      entidad_federativa: "Jalisco",
      pais: "México",
      documento_rfc: "rfc_hotelplaza.pdf",
      identificacion: "ine_ana.pdf",
      foto_proveedor: null,
      estado: "activo",
    },
    {
      id_proveedor: 3,
      nombre_razon_social: "Restaurante Los Compadres",
      tipo_proveedor: "Restaurante",
      rfc: "RLC950810XY3",
      descripcion_servicio: "Servicio de alimentos y catering",
      metodo_pago: "Efectivo",
      nombre_contacto: "Carlos Ramírez Torres",
      telefono: "5553456789",
      correo: "loscompadres@email.com",
      direccion: "Calle Morelos 123",
      ciudad: "Monterrey",
      entidad_federativa: "Nuevo León",
      pais: "México",
      documento_rfc: "rfc_loscompadres.pdf",
      identificacion: "ine_carlos.pdf",
      foto_proveedor: null,
      estado: "activo",
    },
    {
      id_proveedor: 4,
      nombre_razon_social: "Suministros Industriales del Norte",
      tipo_proveedor: "Otro",
      rfc: "SIN910425QR7",
      descripcion_servicio: "Venta de suministros y materiales industriales",
      metodo_pago: "Transferencia",
      nombre_contacto: "María Elena González",
      telefono: "5554567890",
      correo: "ventas@suministrosnorte.com",
      direccion: "Av. Industrial 890",
      ciudad: "Querétaro",
      entidad_federativa: "Querétaro",
      pais: "México",
      documento_rfc: "rfc_suministros.pdf",
      identificacion: "ine_maria.pdf",
      foto_proveedor: null,
      estado: "activo",
    },
    {
      id_proveedor: 5,
      nombre_razon_social: "Express Viajes y Turismo",
      tipo_proveedor: "Transporte",
      rfc: "EVT930715ST2",
      descripcion_servicio: "Agencia de viajes y transporte turístico",
      metodo_pago: "Transferencia",
      nombre_contacto: "Luis Fernando Pérez",
      telefono: "5555678901",
      correo: "info@expressviajes.com",
      direccion: "Paseo de la Reforma 456",
      ciudad: "Ciudad de México",
      entidad_federativa: "Ciudad de México",
      pais: "México",
      documento_rfc: "rfc_expressviajes.pdf",
      identificacion: "ine_luis.pdf",
      foto_proveedor: null,
      estado: "activo",
    },
  ]);

  // Estados para controlar los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  // Funciones para manejar los modales
  const manejarVer = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalVerAbierto(true);
    console.log("Ver proveedor:", proveedor);
  };

  const manejarEditar = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalEditarAbierto(true);
    console.log("Editar proveedor:", proveedor);
  };

  const manejarEliminar = async (proveedor) => {
    const confirmado = await modalEliminarProveedor(proveedor, async () => {
      eliminarProveedor(proveedor.id_proveedor); // ✅ Ahora pasamos el ID correcto
    });

    if (confirmado) {
      console.log("Proveedor eliminado:", proveedor);
    }
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
    console.log("Agregar nuevo proveedor");
  };

  // Función para cerrar modales
  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setModalAgregarAbierto(false);
    setProveedorSeleccionado(null);
  };

  // Función para agregar proveedor
  const agregarProveedor = (nuevoProveedor) => {
    const proveedorConId = {
      ...nuevoProveedor,
      id_proveedor:
        proveedores.length > 0
          ? Math.max(...proveedores.map((p) => p.id_proveedor)) + 1
          : 1,
      estado: "activo",
    };
    setProveedores([...proveedores, proveedorConId]);
    console.log("✅ Proveedor agregado:", proveedorConId);
  };

  // Función para actualizar proveedor
  const actualizarProveedor = (proveedorActualizado) => {
    setProveedores(
      proveedores.map((p) =>
        p.id_proveedor === proveedorActualizado.id_proveedor
          ? proveedorActualizado
          : p
      )
    );
    cerrarModales();
  };

  // Función para eliminar proveedor
  const eliminarProveedor = (id) => {
    setProveedores(proveedores.filter((p) => p.id_proveedor !== id));
    cerrarModales();
  };

  return (
    <PrincipalComponente>
      <div className="proveedores-principal">
        <TablaProveedores
          proveedores={proveedores}
          setProveedores={setProveedores}
          onVer={manejarVer}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          onAgregar={manejarAgregar}
        />

        {/* Modal VER */}
        {modalVerAbierto && proveedorSeleccionado && (
          <ModalVerProveedor
            proveedor={proveedorSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

        {/* Modal EDITAR */}
        {modalEditarAbierto && proveedorSeleccionado && (
          <ModalEditarProveedor
            proveedor={proveedorSeleccionado}
            onGuardar={actualizarProveedor}
            onCerrar={cerrarModales}
          />
        )}

        {/* ✅ Modal AGREGAR - YA FUNCIONAL */}
        {modalAgregarAbierto && (
          <ModalAgregarProveedor
            onGuardar={agregarProveedor}
            onCerrar={cerrarModales}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default ProveedoresPrincipal;
