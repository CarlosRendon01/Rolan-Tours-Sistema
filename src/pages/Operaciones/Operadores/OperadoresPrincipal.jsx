import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaOperadores from './Componentes/TablaOperadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './OperadoresPrincipal.css';
import ModalAgregarOperador from './ModalesOperadores/ModalAgregarOperador';
import ModalVerOperador from './ModalesOperadores/ModalVerOperador';
import ModalEditarOperador from './ModalesOperadores/ModalEditarOperador';
import { modalEliminarOperador } from './ModalesOperadores/ModalEliminarOperador';

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
            
            const response = await axios.get("http://127.0.0.1:8000/api/operadores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000 
            });

            setOperadores(response.data);
            
        } catch (error) {
            console.error('❌ Error al cargar operadores:', error);
            
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
            const operadorData = {
                nombre: nuevoOperador.nombre,
                apellido_paterno: nuevoOperador.apellidoPaterno,
                apellido_materno: nuevoOperador.apellidoMaterno,
                edad: parseInt(nuevoOperador.edad),
                correo_electronico: nuevoOperador.correoElectronico,
                telefono_personal: nuevoOperador.telefonoPersonal,
                telefono_emergencia: nuevoOperador.telefonoEmergencia,
                telefono_familiar: nuevoOperador.telefonoFamiliar || null,
                numero_licencia: nuevoOperador.numeroLicencia,
                fecha_vigencia_licencia: nuevoOperador.fechaVigenciaLicencia,
                fecha_vencimiento_licencia: nuevoOperador.fechaVencimientoLicencia,
                fecha_vencimiento_examen: nuevoOperador.fechaVencimientoExamen,
                comentarios: nuevoOperador.comentarios || null,
            };
            
            const response = await axios.post(
                "http://127.0.0.1:8000/api/operadores",
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
            
        } catch (error) {
            console.error("❌ Error al crear operador:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error; 
        }
    };

    const actualizarOperador = async (operadorActualizado) => {
        try {
            const token = localStorage.getItem("token");
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
                `http://127.0.0.1:8000/api/operadores/${operadorActualizado.id}`,
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
            
        } catch (error) {
            console.error("❌ Error al actualizar operador:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
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