import React, { useState } from 'react';
import axios from 'axios';
import TablaGuias from './Componentes/TablaGuias';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './GuiasPrincipal.css';
import ModalAgregarGuia from './ModalesGuias/ModalAgregarGuia';
import ModalVerGuia from './ModalesGuias/ModalVerGuia';
import ModalEditarGuia from './ModalesGuias/ModalEditarGuia';
import { modalEliminarGuia } from './ModalesGuias/ModalEliminarGuia';

const GuiasPrincipal = () => {
    // Estado para almacenar los guías
    const [guias, setGuias] = useState([]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState(null);

    const recargarGuias = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/guias", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setGuias(response.data);
            console.log('✅ Guias recargados');
        } catch (error) {
            console.error('❌ Error al recargar guias:', error);
        }
    };

    // Funciones para manejar los modales
    const manejarVer = (guia) => {
        setGuiaSeleccionado(guia);
        setModalVerAbierto(true);
        console.log('Ver guía:', guia);
    };

    const manejarEditar = (guia) => {
        setGuiaSeleccionado(guia);
        setModalEditarAbierto(true);
        console.log('Editar guía:', guia);
    };

    const manejarEliminar = async (guia) => {
        const confirmado = await modalEliminarGuia(guia, recargarGuias);
        if (confirmado) {
            console.log('Guía eliminado:', guia);
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
        console.log('Agregar nuevo guía');
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setGuiaSeleccionado(null);
    };

    // Función para agregar guía
    const agregarGuia = async (nuevoGuia) => {
        try {
            const token = localStorage.getItem("token");

            // Preparar datos para enviar al backend
            const guiaData = {
                nombre: nuevoGuia.nombre,
                apellido_paterno: nuevoGuia.apellido_paterno,
                apellido_materno: nuevoGuia.apellido_materno,
                fecha_nacimiento: nuevoGuia.fecha_nacimiento,
                email: nuevoGuia.email,
                telefono: nuevoGuia.telefono,
                telefono_emergencia: nuevoGuia.telefono_emergencia,
                contacto_emergencia: nuevoGuia.contacto_emergencia,
                ciudad: nuevoGuia.ciudad,
                estado: nuevoGuia.estado,
                costo_dia: parseFloat(nuevoGuia.costo_dia) || 0,
                estado_operativo: nuevoGuia.estado_operativo,
                nss: nuevoGuia.nss || null,
                institucion_seguro: nuevoGuia.institucion_seguro || null,
                idiomas: nuevoGuia.idiomas || null,
                experiencia_anos: parseInt(nuevoGuia.experiencia_anos) || 0,
                especialidades: nuevoGuia.especialidades || null,
                certificacion_oficial: nuevoGuia.certificacion_oficial || null,
                zona_servicio: nuevoGuia.zona_servicio || null,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/guias",
                guiaData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            console.log("✅ Guía creado:", response.data);
            cerrarModales();
            await recargarGuias(); // Recargar la lista
        } catch (error) {
            console.error("❌ Error al crear guía:", error);
            alert("Error al crear guía: " + (error.response?.data?.error || error.message));
        }
    };

    // Función para actualizar guía
    const actualizarGuia = async (guiaActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const guiaData = {
                nombre: guiaActualizado.nombre,
                apellido_paterno: guiaActualizado.apellido_paterno,
                apellido_materno: guiaActualizado.apellido_materno,
                fecha_nacimiento: guiaActualizado.fecha_nacimiento,
                email: guiaActualizado.email,
                telefono: guiaActualizado.telefono,
                telefono_emergencia: guiaActualizado.telefono_emergencia,
                contacto_emergencia: guiaActualizado.contacto_emergencia,
                ciudad: guiaActualizado.ciudad,
                estado: guiaActualizado.estado,
                costo_dia: parseFloat(guiaActualizado.costo_dia) || 0,
                estado_operativo: guiaActualizado.estado_operativo,
                nss: guiaActualizado.nss || null,
                institucion_seguro: guiaActualizado.institucion_seguro || null,
                idiomas: guiaActualizado.idiomas || null,
                experiencia_anos: parseInt(guiaActualizado.experiencia_anos) || 0,
                especialidades: guiaActualizado.especialidades || null,
                certificacion_oficial: guiaActualizado.certificacion_oficial || null,
                zona_servicio: guiaActualizado.zona_servicio || null,
            };

            const response = await axios.put(
                `http://127.0.0.1:8000/api/guias/${guiaActualizado.id}`,
                guiaData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            console.log("✅ Guía actualizado:", response.data);
            cerrarModales();
            await recargarGuias(); // Recargar la lista
        } catch (error) {
            console.error("❌ Error al actualizar guía:", error);
            alert("Error al actualizar guía: " + (error.response?.data?.error || error.message));
        }
    };

    // Función para eliminar guía
    const eliminarGuia = (id) => {
        setGuias(guias.filter(g => g.id !== id));
        cerrarModales();
    };

    return (
        <PrincipalComponente>
            <div className="guias-principal">
                <TablaGuias
                    guias={guias}
                    setGuias={setGuias}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                />

                {/* Modal VER */}
                {modalVerAbierto && guiaSeleccionado && (
                    <ModalVerGuia
                        guia={guiaSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal EDITAR */}
                {modalEditarAbierto && guiaSeleccionado && (
                    <ModalEditarGuia
                        guia={guiaSeleccionado}
                        onGuardar={actualizarGuia}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal AGREGAR */}
                {modalAgregarAbierto && (
                    <ModalAgregarGuia
                        onGuardar={agregarGuia}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default GuiasPrincipal;