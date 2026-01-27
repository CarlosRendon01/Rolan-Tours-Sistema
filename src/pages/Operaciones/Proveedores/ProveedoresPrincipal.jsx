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

            const formData = new FormData();

            formData.append('nombre_razon_social', nuevoProveedor.nombre_razon_social);
            formData.append('tipo_proveedor', nuevoProveedor.tipo_proveedor);
            formData.append('rfc', nuevoProveedor.rfc.toUpperCase());
            formData.append('descripcion_servicio', nuevoProveedor.descripcion_servicio || '');
            formData.append('nombre_contacto', nuevoProveedor.nombre_contacto);
            formData.append('telefono', nuevoProveedor.telefono);
            formData.append('correo', nuevoProveedor.correo);
            formData.append('direccion', nuevoProveedor.direccion);
            formData.append('ciudad', nuevoProveedor.ciudad);
            formData.append('entidad_federativa', nuevoProveedor.entidad_federativa);
            formData.append('pais', nuevoProveedor.pais);
            formData.append('metodo_pago', nuevoProveedor.metodo_pago);

            if (nuevoProveedor.foto_proveedor instanceof File) {
                formData.append('foto_proveedor', nuevoProveedor.foto_proveedor);
            }
            if (nuevoProveedor.documento_rfc instanceof File) {
                formData.append('documento_rfc', nuevoProveedor.documento_rfc);
            }
            if (nuevoProveedor.identificacion instanceof File) {
                formData.append('identificacion', nuevoProveedor.identificacion);
            }

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/proveedores`,
                formData,
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
            throw error;
        }
    };

    const actualizarProveedor = async (proveedorActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const tieneArchivosNuevos =
                (proveedorActualizado.foto_proveedor instanceof File) ||
                (proveedorActualizado.documento_rfc instanceof File) ||
                (proveedorActualizado.identificacion instanceof File);

            if (tieneArchivosNuevos) {
                const formData = new FormData();

                formData.append('nombre_razon_social', proveedorActualizado.nombre_razon_social);
                formData.append('tipo_proveedor', proveedorActualizado.tipo_proveedor);
                formData.append('rfc', proveedorActualizado.rfc.toUpperCase());
                formData.append('descripcion_servicio', proveedorActualizado.descripcion_servicio || '');
                formData.append('nombre_contacto', proveedorActualizado.nombre_contacto);
                formData.append('telefono', proveedorActualizado.telefono);
                formData.append('correo', proveedorActualizado.correo);
                formData.append('direccion', proveedorActualizado.direccion);
                formData.append('ciudad', proveedorActualizado.ciudad);
                formData.append('entidad_federativa', proveedorActualizado.entidad_federativa);
                formData.append('pais', proveedorActualizado.pais);
                formData.append('metodo_pago', proveedorActualizado.metodo_pago);

                if (proveedorActualizado.foto_proveedor instanceof File) {
                    formData.append('foto_proveedor', proveedorActualizado.foto_proveedor);
                }
                if (proveedorActualizado.documento_rfc instanceof File) {
                    formData.append('documento_rfc', proveedorActualizado.documento_rfc);
                }
                if (proveedorActualizado.identificacion instanceof File) {
                    formData.append('identificacion', proveedorActualizado.identificacion);
                }

                formData.append('_method', 'PUT');

                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}/proveedores/${proveedorActualizado.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        }
                    }
                );

                await recargarProveedores();
                return response.data;

            } else {
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
                            "Content-Type": "application/json",
                        }
                    }
                );

                await recargarProveedores();
                return response.data;
            }

        } catch (error) {
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