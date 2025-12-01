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
    // ✅ SOLUCIÓN: Agregar el estado de proveedores
    const [proveedores, setProveedores] = useState([]);

    // Estado para almacenar los hospedajes
    const [hospedajes, setHospedajes] = useState([]);

    // Estados para controlar los modales (preparados para el futuro)
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [hospedajeSeleccionado, setHospedajeSeleccionado] = useState(null);

    useEffect(() => {
        recargarHospedajes();
        recargarProveedores();
    }, []);

    const recargarHospedajes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/hospedajes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setHospedajes(response.data);
            console.log('✅ Hospedajes recargados');
        } catch (error) {
            console.error('❌ Error al recargar hospedajes:', error);
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

    // Funciones para manejar los modales
    const manejarVer = (hospedaje) => {
        setHospedajeSeleccionado(hospedaje);
        setModalVerAbierto(true);
        console.log('Ver hospedaje:', hospedaje);
        // TODO: Implementar modal cuando esté listo
    };

    const manejarEditar = (hospedaje) => {
        setHospedajeSeleccionado(hospedaje);
        setModalEditarAbierto(true);
        console.log('Editar hospedaje:', hospedaje);
        // TODO: Implementar modal cuando esté listo
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
        console.log('Agregar nuevo hospedaje');
        // TODO: Implementar modal cuando esté listo
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalAgregarAbierto(false);
        setHospedajeSeleccionado(null);
    };

    // Función para agregar hospedaje
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

    return (
        <PrincipalComponente>
            <div className="hospedaje-principal">
                <TablaHospedaje
                    hospedajes={hospedajes}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                />

                {/* TODO: Descomentar cuando los modales estén implementados */}

                {/* Modal VER */}
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

                {/* Modal AGREGAR */}
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