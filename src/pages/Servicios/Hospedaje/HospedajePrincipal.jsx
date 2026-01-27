import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaHospedaje from './Componentes/TablaHospedaje';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import './HospedajePrincipal.css';
import ModalAgregarHospedaje from './ModalesHospedaje/ModalAgregarHospedaje';
import ModalVerHospedaje from './ModalesHospedaje/ModalVerHospedaje';
import ModalEditarHospedaje from './ModalesHospedaje/ModalEditarHospedaje';
import { modalEliminarHospedaje } from './ModalesHospedaje/ModalEliminarHospedaje';
import { API_CONFIG } from "../../../config/api";

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

            const response = await axios.get(`${API_CONFIG.BASE_URL}/hospedajes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setHospedajes(response.data);

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

    const recargarProveedores = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_CONFIG.BASE_URL}/proveedores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setProveedores(response.data);
        } catch (error) {
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
                await axios.delete(`${API_CONFIG.BASE_URL}/hospedajes/${hospedaje.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                });
                await recargarHospedajes();
            } catch (error) {
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
                const value = nuevoHospedaje[key];

                if (key === 'disponibilidad') {
                    formData.append(key, value ? '1' : '0');
                }
                else if (value instanceof File) {
                    formData.append(key, value);
                }
                else if (value !== null && val1ue !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/hospedajes`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            cerrarModales();
            await recargarHospedajes();
        } catch (error) {
            throw error;
        }
    };

    const actualizarHospedaje = async (hospedajeActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            Object.keys(hospedajeActualizado).forEach(key => {
                const value = hospedajeActualizado[key];

                if (key === 'disponibilidad') {
                    formData.append(key, value ? '1' : '0');
                }
                else if (value instanceof File) {
                    formData.append(key, value);
                }
                else if (key === 'foto_servicio' && typeof value === 'string') {
                }
                else if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            formData.append('_method', 'PUT');

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/hospedajes/${hospedajeActualizado.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            cerrarModales();
            await recargarHospedajes();
        } catch (error) {
            throw error;
        }
    };

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