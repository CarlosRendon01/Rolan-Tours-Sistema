import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaHospedaje from './Componentes/TablaHospedaje';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './HospedajePrincipal.css';
import ModalAgregarHospedaje from './ModalesHospedaje/ModalAgregarHospedaje';
import ModalVerHospedaje from './ModalesHospedaje/ModalVerHospedaje';
import ModalEditarHospedaje from './ModalesHospedaje/ModalEditarHospedaje';
import { modalEliminarHospedaje } from './ModalesHospedaje/ModalEliminarHospedaje';

const HospedajePrincipal = () => {
    const [proveedores, setProveedores] = useState([]);
    const [hospedajes, setHospedajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [hospedajeSeleccionado, setHospedajeSeleccionado] = useState(null);

    useEffect(() => {
        recargarHospedajes();
        recargarProveedores();
    }, []);

    const recargarHospedajes = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get("http://127.0.0.1:8000/api/hospedajes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setHospedajes(response.data);
            console.log('✅ Hospedajes recargados');

        } catch (error) {
            console.error('❌ Error al recargar hospedajes:', error);

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
            console.log('✅ Proveedores recargados');
        } catch (error) {
            console.error('❌ Error al recargar proveedores:', error);
        }
    };

    const manejarVer = (hospedaje) => {
        setHospedajeSeleccionado(hospedaje);
        setModalVerAbierto(true);
    };

    const manejarEditar = (hospedaje) => {
        setHospedajeSeleccionado(hospedaje);
        setModalEditarAbierto(true);
    };

    const manejarEliminar = async (hospedaje) => {
        const confirmado = await modalEliminarHospedaje(hospedaje, async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://127.0.0.1:8000/api/hospedajes/${hospedaje.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                });
                console.log('✅ Hospedaje eliminado');
                await recargarHospedajes();
            } catch (error) {
                console.error('❌ Error al eliminar hospedaje:', error);
            }
        });
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
    };

    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalAgregarAbierto(false);
        setHospedajeSeleccionado(null);
    };

    const agregarHospedaje = async (nuevoHospedaje) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            Object.keys(nuevoHospedaje).forEach(key => {
                if (nuevoHospedaje[key] !== null && nuevoHospedaje[key] !== undefined) {
                    formData.append(key, nuevoHospedaje[key]);
                }
            });

            const response = await axios.post(
                "http://127.0.0.1:8000/api/hospedajes",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log("✅ Hospedaje creado:", response.data);
            cerrarModales();
            await recargarHospedajes();
        } catch (error) {
            console.error("❌ Error al crear hospedaje:", error);
            throw error;
        }
    };

    const actualizarHospedaje = async (hospedajeActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.keys(hospedajeActualizado).forEach(key => {
                if (hospedajeActualizado[key] !== null && hospedajeActualizado[key] !== undefined) {
                    formData.append(key, hospedajeActualizado[key]);
                }
            });

            const response = await axios.post(
                `http://127.0.0.1:8000/api/hospedajes/${hospedajeActualizado.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log("✅ Hospedaje actualizado:", response.data);
            cerrarModales();
            await recargarHospedajes();
        } catch (error) {
            console.error("❌ Error al actualizar hospedaje:", error);
            throw error;
        }
    };

    // Manejo de errores
    if (error) {
        return (
            <PrincipalComponente>
                <div className="hospedaje-error-container">
                    <div className="hospedaje-error-box">
                        <h2 className="hospedaje-error-title">
                            ❌ Error al cargar hospedajes
                        </h2>
                        <p className="hospedaje-error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarHospedajes}
                            className="hospedaje-error-button"
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
            <div className="hospedaje-principal">
                <TablaHospedaje
                    hospedajes={hospedajes}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                    cargando={cargando}
                    onRecargar={recargarHospedajes}
                />

                {modalVerAbierto && hospedajeSeleccionado && (
                    <ModalVerHospedaje
                        hospedaje={hospedajeSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalEditarAbierto && hospedajeSeleccionado && (
                    <ModalEditarHospedaje
                        hospedaje={hospedajeSeleccionado}
                        onGuardar={actualizarHospedaje}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}

                {modalAgregarAbierto && (
                    <ModalAgregarHospedaje
                        onGuardar={agregarHospedaje}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default HospedajePrincipal;