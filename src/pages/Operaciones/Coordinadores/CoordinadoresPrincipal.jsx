import React, { useState } from 'react';
import axios from 'axios';
import TablaCoordinadores from './Componentes/TablaCoordinadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import ModalAgregarCoordinador from './ModalesCoordinadores/ModalAgregarCoordinador';
import ModalVerCoordinador from './ModalesCoordinadores/ModalVerCoordinador';
import ModalEditarCoordinador from './ModalesCoordinadores/ModalEditarCoordinador';
import { modalEliminarCoordinador } from './ModalesCoordinadores/Modaleliminarcoordinador';
import './CoordinadoresPrincipal.css';

const CoordinadoresPrincipal = () => {
    // Estado para almacenar los coordinadores
    const [coordinadores, setCoordinadores] = useState([]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [coordinadorSeleccionado, setCoordinadorSeleccionado] = useState(null);

    const recargarCoordinadores = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/coordinadores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setCoordinadores(response.data);
            console.log('✅ Coordinadores recargados');
        } catch (error) {
            console.error('❌ Error al recargar coordinadores:', error);
        }
    };

    // Funciones para manejar los modales
    const manejarVer = (coordinador) => {
        setCoordinadorSeleccionado(coordinador);
        setModalVerAbierto(true);
        console.log('Ver coordinador:', coordinador);
    };

    const manejarEditar = (coordinador) => {
        setCoordinadorSeleccionado(coordinador);
        setModalEditarAbierto(true);
        console.log('Editar coordinador:', coordinador);
    };

    const manejarEliminar = async (coordinador) => {
        const confirmado = await modalEliminarCoordinador(coordinador, recargarCoordinadores);
        if (confirmado) {
            console.log('✅ Coordinador eliminado y lista actualizada');
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
        console.log('Agregar nuevo coordinador');
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setCoordinadorSeleccionado(null);
    };

    // Función para agregar coordinador
    const agregarCoordinador = async (nuevoCoordinador) => {
        try {
            const token = localStorage.getItem("token");

            // Preparar datos para enviar al backend
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

            console.log("✅ Coordinador creado:", response.data);
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

            console.log("✅ Coordinador actualizado:", response.data);
            cerrarModales();
            await recargarCoordinadores();
        } catch (error) {
            console.error("❌ Error al actualizar coordinador:", error);
            alert("Error al actualizar coordinador: " + (error.response?.data?.error || error.message));
        }
    };

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
                />

                {/* Los modales se agregarán aquí más adelante */}
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