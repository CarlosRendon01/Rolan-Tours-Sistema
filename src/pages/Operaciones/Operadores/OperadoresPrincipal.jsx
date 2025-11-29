import React, { useState } from 'react';
import axios from 'axios';
import TablaOperadores from './Componentes/TablaOperadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './OperadoresPrincipal.css';
import ModalAgregarOperador from './ModalesOperadores/ModalAgregarOperador';
import ModalVerOperador from './ModalesOperadores/ModalVerOperador';
import ModalEditarOperador from './ModalesOperadores/ModalEditarOperador';
import { modalEliminarOperador } from './ModalesOperadores/ModalEliminarOperador';

const OperadoresPrincipal = () => {
    // Estado para almacenar los operadores
    const [operadores, setOperadores] = useState([]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [operadorSeleccionado, setOperadorSeleccionado] = useState(null);

    const recargarOperadores = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/operadores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setOperadores(response.data);
            console.log('✅ Operadores recargados');
        } catch (error) {
            console.error('❌ Error al recargar operadores:', error);
        }
    };

    // Funciones para manejar los modales
    const manejarVer = (operador) => {
        setOperadorSeleccionado(operador);
        setModalVerAbierto(true);
        console.log('Ver operador:', operador);
    };

    const manejarEditar = (operador) => {
        setOperadorSeleccionado(operador);
        setModalEditarAbierto(true);
        console.log('Editar operador:', operador);
    };

    const manejarEliminar = async (operador) => {
        const confirmado = await modalEliminarOperador(operador, recargarOperadores);
        if (confirmado) {
            console.log('Operador eliminado:', operador);
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
        console.log('Agregar nuevo operador');
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setOperadorSeleccionado(null);
    };

    // Función para agregar operador
    const agregarOperador = async (nuevoOperador) => {
        try {
            const token = localStorage.getItem("token");

            // ✅ CORREGIDO: Preparar datos exactamente como el backend los espera
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

            console.log("📦 Datos a enviar al backend:", operadorData);

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

            console.log("✅ Operador creado:", response.data);
            await recargarOperadores(); // Recargar la lista
            return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
        } catch (error) {
            console.error("❌ Error al crear operador:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error; // ✅ Lanzar el error para que el modal lo maneje
        }
    };

    // Función para actualizar operador
    const actualizarOperador = async (operadorActualizado) => {
        try {
            const token = localStorage.getItem("token");

            // ✅ CORREGIDO: Preparar datos exactamente como el backend los espera
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

            console.log("📦 Datos a actualizar:", operadorData);

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

            console.log("✅ Operador actualizado:", response.data);
            await recargarOperadores(); // Recargar la lista
            return response.data; // ✅ Retornar los datos para que el modal sepa que terminó
        } catch (error) {
            console.error("❌ Error al actualizar operador:", error);
            console.error("❌ Respuesta del servidor:", error.response?.data);
            throw error; // ✅ Lanzar el error para que el modal lo maneje
        }
    };

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
                />

                {/* Modal VER */}
                {modalVerAbierto && operadorSeleccionado && (
                    <ModalVerOperador
                        operador={operadorSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal EDITAR */}
                {modalEditarAbierto && operadorSeleccionado && (
                    <ModalEditarOperador
                        operador={operadorSeleccionado}
                        onGuardar={actualizarOperador}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal AGREGAR */}
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