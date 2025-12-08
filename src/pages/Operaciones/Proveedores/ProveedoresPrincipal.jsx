import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaProveedores from './Componentes/TablaProveedores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import ModalAgregarProveedor from './ModalesProveedores/ModalAgregarProovedor';
import ModalVerProveedor from './ModalesProveedores/ModalVerProveedor';
import ModalEditarProveedor from './ModalesProveedores/ModalEditarProveedor';
import { modalEliminarProveedor } from './ModalesProveedores/ModalEliminarProveedor';
import './ProveedoresPrincipal.css';

const ProveedoresPrincipal = () => {
    // Estado para almacenar los proveedores
    const [proveedores, setProveedores] = useState([]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    const recargarProveedores = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/proveedores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setProveedores(response.data);
            console.log('✅ Proveedores cargados:', response.data);
        } catch (error) {
            console.error('❌ Error al cargar proveedores:', error);
        }
    };

    // Cargar proveedores al montar el componente
    useEffect(() => {
        recargarProveedores();
    }, []);

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
        const confirmado = await modalEliminarProveedor(proveedor, await recargarProveedores)
        if (confirmado) {
            console.log('Proveedor eliminado:', proveedor);
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
    const agregarProveedor = async (nuevoProveedor) => {
        try {
            const token = localStorage.getItem("token");

            const proveedorData = {
                nombre_razon_social: nuevoProveedor.nombre_razon_social,
                tipo_proveedor: nuevoProveedor.tipo_proveedor,
                rfc: nuevoProveedor.rfc.toUpperCase(),
                descripcion_servicio: nuevoProveedor.descripcion_servicio || null,
                nombre_contacto: nuevoProveedor.nombre_contacto,
                telefono: nuevoProveedor.telefono,
                correo: nuevoProveedor.correo,
                direccion: nuevoProveedor.direccion,
                ciudad: nuevoProveedor.ciudad,
                entidad_federativa: nuevoProveedor.entidad_federativa,
                pais: nuevoProveedor.pais,
                metodo_pago: nuevoProveedor.metodo_pago,
            };

            console.log("📦 Datos a enviar al backend:", proveedorData);

            const response = await axios.post(
                "http://127.0.0.1:8000/api/proveedores",
                proveedorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            console.log("✅ Proveedor creado:", response.data);
            await recargarProveedores(); // Recargar la lista
            return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error; // ✅ Lanzar el error para que el modal lo maneje
        }
    };

    // Función para actualizar proveedor
    const actualizarProveedor = async (proveedorActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const proveedorData = {
                nombre_razon_social: proveedorActualizado.nombre_razon_social,
                tipo_proveedor: proveedorActualizado.tipo_proveedor,
                rfc: proveedorActualizado.rfc.toUpperCase(),
                descripcion_servicio: proveedorActualizado.descripcion_servicio || null,
                nombre_contacto: proveedorActualizado.nombre_contacto,
                telefono: proveedorActualizado.telefono,
                correo: proveedorActualizado.correo,
                direccion: proveedorActualizado.direccion,
                ciudad: proveedorActualizado.ciudad,
                entidad_federativa: proveedorActualizado.entidad_federativa,
                pais: proveedorActualizado.pais,
                metodo_pago: proveedorActualizado.metodo_pago,
            };

            console.log("📦 Datos a enviar al backend:", proveedorData);

            const response = await axios.put(
                `http://127.0.0.1:8000/api/proveedores/${proveedorActualizado.id}`,
                proveedorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            console.log("✅ Proveedor creado:", response.data);
            await recargarProveedores(); // Recargar la lista
            return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error; // ✅ Lanzar el error para que el modal lo maneje
        }
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
