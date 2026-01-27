import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaOperadores from './Componentes/TablaOperadores';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import './OperadoresPrincipal.css';
import ModalAgregarOperador from './ModalesOperadores/ModalAgregarOperador';
import ModalVerOperador from './ModalesOperadores/ModalVerOperador';
import ModalEditarOperador from './ModalesOperadores/ModalEditarOperador';
import { modalEliminarOperador } from './ModalesOperadores/ModalEliminarOperador';
import { API_CONFIG } from '../../../config/api';

const OperadoresPrincipal = () => {
    const [operadores, setOperadores] = useState([]);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [operadorSeleccionado, setOperadorSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        recargarOperadores();
    }, []);

    const recargarOperadores = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get(`${API_CONFIG.BASE_URL}/operadores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setOperadores(response.data);

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

    const manejarVer = (operador) => {
        setOperadorSeleccionado(operador);
        setModalVerAbierto(true);
    };

    const manejarEditar = (operador) => {
        setOperadorSeleccionado(operador);
        setModalEditarAbierto(true);
    };

    const manejarEliminar = async (operador) => {
        const confirmado = await modalEliminarOperador(operador, recargarOperadores);
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
        setOperadorSeleccionado(null);
    };

    const agregarOperador = async (nuevoOperador) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append('nombre', nuevoOperador.nombre);
            formData.append('apellido_paterno', nuevoOperador.apellidoPaterno);
            formData.append('apellido_materno', nuevoOperador.apellidoMaterno);
            formData.append('edad', parseInt(nuevoOperador.edad));
            formData.append('correo_electronico', nuevoOperador.correoElectronico);
            formData.append('telefono_personal', nuevoOperador.telefonoPersonal);
            formData.append('telefono_emergencia', nuevoOperador.telefonoEmergencia);
            formData.append('telefono_familiar', nuevoOperador.telefonoFamiliar || '');
            formData.append('numero_licencia', nuevoOperador.numeroLicencia);
            formData.append('fecha_vigencia_licencia', nuevoOperador.fechaVigenciaLicencia);
            formData.append('fecha_vencimiento_licencia', nuevoOperador.fechaVencimientoLicencia);
            formData.append('fecha_vencimiento_examen', nuevoOperador.fechaVencimientoExamen);
            formData.append('comentarios', nuevoOperador.comentarios || '');

            if (nuevoOperador.foto instanceof File) {
                formData.append('foto', nuevoOperador.foto);
            }
            if (nuevoOperador.ine instanceof File) {
                formData.append('ine', nuevoOperador.ine);
            }

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/operadores`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            await recargarOperadores();
            return response.data;

        } catch (error) {
            throw error;
        }
    };

    const actualizarOperador = async (operadorActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const tieneArchivosNuevos =
                (operadorActualizado.foto instanceof File) ||
                (operadorActualizado.ine instanceof File);

            if (tieneArchivosNuevos) {
                const formData = new FormData();

                formData.append('nombre', operadorActualizado.nombre);
                formData.append('apellido_paterno', operadorActualizado.apellidoPaterno);
                formData.append('apellido_materno', operadorActualizado.apellidoMaterno);
                formData.append('edad', parseInt(operadorActualizado.edad));
                formData.append('correo_electronico', operadorActualizado.correoElectronico);
                formData.append('telefono_personal', operadorActualizado.telefonoPersonal);
                formData.append('telefono_emergencia', operadorActualizado.telefonoEmergencia);
                formData.append('telefono_familiar', operadorActualizado.telefonoFamiliar || '');
                formData.append('numero_licencia', operadorActualizado.numeroLicencia);
                formData.append('fecha_vigencia_licencia', operadorActualizado.fechaVigenciaLicencia);
                formData.append('fecha_vencimiento_licencia', operadorActualizado.fechaVencimientoLicencia);
                formData.append('fecha_vencimiento_examen', operadorActualizado.fechaVencimientoExamen);
                formData.append('comentarios', operadorActualizado.comentarios || '');

                if (operadorActualizado.foto instanceof File) {
                    formData.append('foto', operadorActualizado.foto);
                }
                if (operadorActualizado.ine instanceof File) {
                    formData.append('ine', operadorActualizado.ine);
                }

                formData.append('_method', 'PUT');

                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}/operadores/${operadorActualizado.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        }
                    }
                );

                await recargarOperadores();
                return response.data;

            } else {
                const operadorData = {
                    nombre: operadorActualizado.nombre,
                    apellido_paterno: operadorActualizado.apellidoPaterno,
                    apellido_materno: operadorActualizado.apellidoMaterno,
                    edad: parseInt(operadorActualizado.edad),
                    correo_electronico: operadorActualizado.correoElectronico,
                    telefono_personal: operadorActualizado.telefonoPersonal,
                    telefono_emergencia: operadorActualizado.telefonoEmergencia,
                    telefono_familiar: operadorActualizado.telefonoFamiliar || null,
                    numero_licencia: operadorActualizado.numeroLicencia,
                    fecha_vigencia_licencia: operadorActualizado.fechaVigenciaLicencia,
                    fecha_vencimiento_licencia: operadorActualizado.fechaVencimientoLicencia,
                    fecha_vencimiento_examen: operadorActualizado.fechaVencimientoExamen,
                    comentarios: operadorActualizado.comentarios || null,
                };

                const response = await axios.put(
                    `${API_CONFIG.BASE_URL}/operadores/${operadorActualizado.id}`,
                    operadorData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        }
                    }
                );

                await recargarOperadores();
                return response.data;
            }

        } catch (error) {
            throw error;
        }
    };

    if (error) {
        return (
            <PrincipalComponente>
                <div className="error-container">
                    <div className="error-box">
                        <h2 className="error-title">
                            ❌ Error al cargar operadores
                        </h2>
                        <p className="error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarOperadores}
                            className="error-button"
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
            <div className="operadores-principal">
                <TablaOperadores
                    operadores={operadores}
                    setOperadores={setOperadores}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                    cargando={cargando}
                    onRecargar={recargarOperadores}
                />

                {modalVerAbierto && operadorSeleccionado && (
                    <ModalVerOperador
                        operador={operadorSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalEditarAbierto && operadorSeleccionado && (
                    <ModalEditarOperador
                        operador={operadorSeleccionado}
                        onGuardar={actualizarOperador}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalAgregarAbierto && (
                    <ModalAgregarOperador
                        onGuardar={agregarOperador}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default OperadoresPrincipal;