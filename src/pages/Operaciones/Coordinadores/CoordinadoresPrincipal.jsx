import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaCoordinadores from './Componentes/TablaCoordinadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import ModalAgregarCoordinador from './ModalesCoordinadores/ModalAgregarCoordinador';
import ModalVerCoordinador from './ModalesCoordinadores/ModalVerCoordinador';
import ModalEditarCoordinador from './ModalesCoordinadores/ModalEditarCoordinador';
import { modalEliminarCoordinador } from './ModalesCoordinadores/Modaleliminarcoordinador';
import './CoordinadoresPrincipal.css';

const CoordinadoresPrincipal = () => {
    const [coordinadores, setCoordinadores] = useState([]);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [coordinadorSeleccionado, setCoordinadorSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        recargarCoordinadores();
    }, []);

    const recargarCoordinadores = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get("http://127.0.0.1:8000/api/coordinadores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setCoordinadores(response.data);

        } catch (error) {
            console.error('❌ Error al recargar coordinadores:', error);

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

    const manejarVer = (coordinador) => {
        setCoordinadorSeleccionado(coordinador);
        setModalVerAbierto(true);
    };

    const manejarEditar = (coordinador) => {
        setCoordinadorSeleccionado(coordinador);
        setModalEditarAbierto(true);
    };

    const manejarEliminar = async (coordinador) => {
        const confirmado = await modalEliminarCoordinador(coordinador, recargarCoordinadores);
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
        setCoordinadorSeleccionado(null);
    };

    const agregarCoordinador = async (nuevoCoordinador) => {
        try {
            const token = localStorage.getItem("token");

            const coordinadorData = {
                nombre: nuevoCoordinador.nombre,
                apellido_paterno: nuevoCoordinador.apellido_paterno,
                apellido_materno: nuevoCoordinador.apellido_materno,
                fecha_nacimiento: nuevoCoordinador.fecha_nacimiento,
                email: nuevoCoordinador.email,
                telefono: nuevoCoordinador.telefono,
                telefono_emergencia: nuevoCoordinador.telefono_emergencia,
                contacto_emergencia: nuevoCoordinador.contacto_emergencia,
                ciudad: nuevoCoordinador.ciudad,
                estado: nuevoCoordinador.estado,
                nss: nuevoCoordinador.nss || null,
                institucion_seguro: nuevoCoordinador.institucion_seguro || null,
                costo_dia: parseFloat(nuevoCoordinador.costo_dia) || 0,
                experiencia_anos: parseInt(nuevoCoordinador.experiencia_anos) || 0,
                idiomas: nuevoCoordinador.idiomas || null,
                especialidades: nuevoCoordinador.especialidades,
                certificacion_oficial: nuevoCoordinador.certificacion_oficial || false,
                comentarios: nuevoCoordinador.comentarios || null,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/coordinadores",
                coordinadorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            cerrarModales();
            await recargarCoordinadores();
        } catch (error) {
            console.error("❌ Error al crear coordinador:", error);
            alert("Error al crear coordinador: " + (error.response?.data?.error || error.message));
        }
    };

    const actualizarCoordinador = async (coordinadorActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const coordinadorData = {
                nombre: coordinadorActualizado.nombre,
                apellido_paterno: coordinadorActualizado.apellido_paterno,
                apellido_materno: coordinadorActualizado.apellido_materno,
                fecha_nacimiento: coordinadorActualizado.fecha_nacimiento,
                email: coordinadorActualizado.email,
                telefono: coordinadorActualizado.telefono,
                telefono_emergencia: coordinadorActualizado.telefono_emergencia,
                contacto_emergencia: coordinadorActualizado.contacto_emergencia,
                ciudad: coordinadorActualizado.ciudad,
                estado: coordinadorActualizado.estado,
                nss: coordinadorActualizado.nss || null,
                institucion_seguro: coordinadorActualizado.institucion_seguro || null,
                costo_dia: parseFloat(coordinadorActualizado.costo_dia) || 0,
                experiencia_anos: parseInt(coordinadorActualizado.experiencia_anos) || 0,
                idiomas: coordinadorActualizado.idiomas || null,
                especialidades: coordinadorActualizado.especialidades,
                certificacion_oficial: coordinadorActualizado.certificacion_oficial || false,
                comentarios: coordinadorActualizado.comentarios || null,
            };

            const response = await axios.put(
                `http://127.0.0.1:8000/api/coordinadores/${coordinadorActualizado.id}`,
                coordinadorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            cerrarModales();
            await recargarCoordinadores();
        } catch (error) {
            console.error("❌ Error al actualizar coordinador:", error);
            alert("Error al actualizar coordinador: " + (error.response?.data?.error || error.message));
        }
    };

    if (error) {
        return (
            <PrincipalComponente>
                <div className="coordinadores-error-container">
                    <div className="coordinadores-error-box">
                        <h2 className="coordinadores-error-title">
                            ❌ Error al cargar coordinadores
                        </h2>
                        <p className="coordinadores-error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarCoordinadores}
                            className="coordinadores-error-button"
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
            <div className="coordinadores-principal">
                <TablaCoordinadores
                    coordinadores={coordinadores}
                    setCoordinadores={setCoordinadores}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                    cargando={cargando}
                    onRecargar={recargarCoordinadores}
                />

                {modalAgregarAbierto && (
                    <ModalAgregarCoordinador
                        onGuardar={agregarCoordinador}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalVerAbierto && coordinadorSeleccionado && (
                    <ModalVerCoordinador
                        coordinador={coordinadorSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalEditarAbierto && coordinadorSeleccionado && (
                    <ModalEditarCoordinador
                        coordinador={coordinadorSeleccionado}
                        onGuardar={actualizarCoordinador}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default CoordinadoresPrincipal;