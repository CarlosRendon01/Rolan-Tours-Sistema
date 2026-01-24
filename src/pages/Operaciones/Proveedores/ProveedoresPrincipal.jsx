import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaProveedores from './Componentes/TablaProveedores';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import ModalAgregarProveedor from './ModalesProveedores/ModalAgregarProovedor';
import ModalVerProveedor from './ModalesProveedores/ModalVerProveedor';
import ModalEditarProveedor from './ModalesProveedores/ModalEditarProveedor';
import { modalEliminarProveedor } from './ModalesProveedores/ModalEliminarProveedor';
import './ProveedoresPrincipal.css';
import { API_CONFIG } from '../../../config/api';

const ProveedoresPrincipal = () => {
    const [proveedores, setProveedores] = useState([]);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        recargarProveedores();
    }, []);

    const recargarProveedores = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get(`${API_CONFIG.BASE_URL}/proveedores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setProveedores(response.data);

        } catch (error) {
            console.error('❌ Error al cargar proveedores:', error);

            if (error.code === 'ECONNABORTED') {
                setError('La conexión tardó demasiado. Verifica tu servidor.');
            } else if (error.response) {
                setError(`Error del servidor: ${error.response.status}`);
            } else if (error.request) {
                setError('No se pudo conectar con el servidor. Verifica que esté corriendo.');
            } else {
                setError(error.message);
            }
        } finally {
            setCargando(false);
        }
    };

    const manejarVer = (proveedor) => {
        setProveedorSeleccionado(proveedor);
        setModalVerAbierto(true);
    };

    const manejarEditar = (proveedor) => {
        setProveedorSeleccionado(proveedor);
        setModalEditarAbierto(true);
    };

    const manejarEliminar = async (proveedor) => {
        const confirmado = await modalEliminarProveedor(proveedor, recargarProveedores);
        if (confirmado) {
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
    };

    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setProveedorSeleccionado(null);
    };

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


            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/proveedores`,
                proveedorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            await recargarProveedores();
            return response.data;
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error;
        }
    };

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


            const response = await axios.put(
                `${API_CONFIG.BASE_URL}/proveedores/${proveedorActualizado.id}`,
                proveedorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            await recargarProveedores();
            return response.data;
        } catch (error) {
            console.error("❌ Error al actualizar proveedor:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error;
        }
    };

    if (error) {
        return (
            <PrincipalComponente>
                <div className="proveedores-error-container">
                    <div className="proveedores-error-box">
                        <h2 className="proveedores-error-title">
                            ❌ Error al cargar proveedores
                        </h2>
                        <p className="proveedores-error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarProveedores}
                            className="proveedores-error-button"
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                </div>
            </PrincipalComponente>
        );
    }

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
                    cargando={cargando}
                    onRecargar={recargarProveedores}
                />

                {modalVerAbierto && proveedorSeleccionado && (
                    <ModalVerProveedor
                        proveedor={proveedorSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalEditarAbierto && proveedorSeleccionado && (
                    <ModalEditarProveedor
                        proveedor={proveedorSeleccionado}
                        onGuardar={actualizarProveedor}
                        onCerrar={cerrarModales}
                    />
                )}

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