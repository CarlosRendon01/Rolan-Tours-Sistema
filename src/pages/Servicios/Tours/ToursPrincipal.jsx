import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import TablaTours from './Componentes/TablaTours';
import ModalAgregarTours from './ModalesTours/ModalAgregarTours';
import ModalEditarTours from './ModalesTours/ModalEditarTours';
import ModalVerTours from './ModalesTours/ModalVerTours';
import { modalEliminarTour } from './ModalesTours/ModalEliminarTours';
import './ToursPrincipal.css';

const ToursPrincipal = () => {
    const [proveedores, setProveedores] = useState([]);
    const [tours, setTours] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [tourAEditar, setTourAEditar] = useState(null);
    const [tourAVer, setTourAVer] = useState(null);

    useEffect(() => {
        recargarTours();
        recargarProveedores();
    }, []);

    const recargarTours = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get("http://127.0.0.1:8000/api/tours", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setTours(response.data);

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
            const response = await axios.get("http://127.0.0.1:8000/api/proveedores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setProveedores(response.data);
        } catch (error) {
        }
    };

    const handleVerTour = (tour) => {
        setTourAVer(tour);
        setModalVerAbierto(true);
    };

    const handleEditarTour = (tour) => {
        setTourAEditar(tour);
        setModalEditarAbierto(true);
    };

    const handleEliminarTour = async (tour) => {
        const confirmado = await modalEliminarTour(tour, async (tourAEliminar) => {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://127.0.0.1:8000/api/tours/${tourAEliminar.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                });
                await recargarTours();
            } catch (error) {
            }
        });
    };

    const handleAgregarTour = () => {
        setModalAgregarAbierto(true);
    };

    const cerrarModales = () => {
        setModalAgregarAbierto(false);
        setModalEditarAbierto(false);
        setModalVerAbierto(false);
        setTourAEditar(null);
        setTourAVer(null);
    };

    const formatearHora = (hora) => {
        if (!hora || typeof hora !== 'string') return hora;

        if (hora.includes(':')) {
            const partes = hora.split(':');
            if (partes.length === 3) {
                return `${partes[0]}:${partes[1]}`;
            }
        }
        return hora;
    };

    const agregarTour = async (nuevoTour) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            Object.keys(nuevoTour).forEach(key => {
                const value = nuevoTour[key];

                if (key === 'idiomas_disponibles') {
                    formData.append(key, JSON.stringify(value));
                }
                else if (key === 'descuento_disponible' || key === 'iva_incluido' ||
                    key === 'transporte_incluido' || key === 'seguro_incluido') {
                    formData.append(key, value ? '1' : '0');
                }

                else if (key === 'hora_salida' || key === 'hora_regreso') {
                    if (value && typeof value === 'string' && value.trim() !== '' && value.includes(':')) {
                        const horaFormateada = formatearHora(value.trim());
                        formData.append(key, horaFormateada);
                    }
                }
                else if (value instanceof File) {
                    formData.append(key, value);
                }
                else if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            const response = await axios.post(
                "http://127.0.0.1:8000/api/tours",
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
            await recargarTours();
        } catch (error) {
            throw error;
        }
    };

    const actualizarTour = async (tourActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.keys(tourActualizado).forEach(key => {
                const value = tourActualizado[key];

                if (key === 'idiomas_disponibles') {
                    formData.append(key, JSON.stringify(value));
                }
                else if (key === 'descuento_disponible' || key === 'iva_incluido' ||
                    key === 'transporte_incluido' || key === 'seguro_incluido') {
                    formData.append(key, value ? '1' : '0');
                }

                else if (key === 'hora_salida' || key === 'hora_regreso') {
                    if (value && typeof value === 'string' && value.trim() !== '' && value.includes(':')) {
                        const horaFormateada = formatearHora(value.trim());
                        formData.append(key, horaFormateada);
                    }
                }
                else if (value instanceof File) {
                    formData.append(key, value);
                }
                else if (key === 'foto_tour' && typeof value === 'string') {
                }
                else if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            const response = await axios.post(
                `http://127.0.0.1:8000/api/tours/${tourActualizado.id}`,
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
            await recargarTours();
        } catch (error) {
            throw error;
        }
    };

    if (error) {
        return (
            <PrincipalComponente>
                <div className="tours-error-container">
                    <div className="tours-error-box">
                        <h2 className="tours-error-title">
                            ❌ Error al cargar tours
                        </h2>
                        <p className="tours-error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarTours}
                            className="tours-error-button"
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
            <div className="tours-principal">
                <TablaTours
                    tours={tours}
                    setTours={setTours}
                    onVer={handleVerTour}
                    onEditar={handleEditarTour}
                    onEliminar={handleEliminarTour}
                    onAgregar={handleAgregarTour}
                    cargando={cargando}
                    onRecargar={recargarTours}
                />

                {modalAgregarAbierto && (
                    <ModalAgregarTours
                        onGuardar={agregarTour}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}

                {modalEditarAbierto && tourAEditar && (
                    <ModalEditarTours
                        tour={tourAEditar}
                        onGuardar={actualizarTour}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}

                {modalVerAbierto && tourAVer && (
                    <ModalVerTours
                        tour={tourAVer}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default ToursPrincipal;