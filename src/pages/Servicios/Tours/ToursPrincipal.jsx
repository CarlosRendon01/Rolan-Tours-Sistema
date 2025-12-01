import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import TablaTours from './Componentes/TablaTours';
import ModalAgregarTours from './ModalesTours/ModalAgregarTours';
import ModalEditarTours from './ModalesTours/ModalEditarTours';
import ModalVerTours from './ModalesTours/ModalVerTours';
import { modalEliminarTour } from './ModalesTours/ModalEliminarTours'; // ✅ NUEVO: Importar modal eliminar
import './ToursPrincipal.css';

const ToursPrincipal = () => {
    // ✅ Lista de proveedores
    const [proveedores,setProveedores] = useState([]);

    // Estado para los tours con datos de ejemplo
    const [tours, setTours] = useState([]);

    // ✅ Estados para controlar los modales
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
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/tours", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            setTours(response.data);
            console.log('✅ Tours recargados');
        } catch (error) {
            console.error('❌ Error al recargar tours:', error);
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

    // ✅ Función para ver tour
    const handleVerTour = (tour) => {
        console.log('Ver tour:', tour);
        setTourAVer(tour);
        setModalVerAbierto(true);
    };

    // ✅ Función para editar tour
    const handleEditarTour = (tour) => {
        console.log('Editar tour:', tour);
        setTourAEditar(tour);
        setModalEditarAbierto(true);
    };

    // ✅ MODIFICADO: Función para eliminar tour con modal mejorado
    const handleEliminarTour = async (tour) => {
        console.log('Eliminar tour:', tour);

        const confirmado = await modalEliminarTour(tour, async (tourAEliminar) => {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://127.0.0.1:8000/api/tours/${tourAEliminar.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                });
                console.log('✅ Tour eliminado');
                await recargarTours();
            } catch (error) {
                console.error('❌ Error al eliminar tour:', error);
            }
        });
    };

    const handleAgregarTour = () => {
        console.log('Agregar nuevo tour');
        setModalAgregarAbierto(true);
    };

    // ✅ Función para cerrar modales
    const cerrarModales = () => {
        setModalAgregarAbierto(false);
        setModalEditarAbierto(false);
        setModalVerAbierto(false);
        setTourAEditar(null);
        setTourAVer(null);
    };

    // ✅ Función para agregar tour
    const agregarTour = async (nuevoTour) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            Object.keys(nuevoTour).forEach(key => {
                if (nuevoTour[key] !== null && nuevoTour[key] !== undefined) {
                    if (key === 'idiomas_disponibles') {
                        formData.append(key, JSON.stringify(nuevoTour[key]));
                    } else {
                        formData.append(key, nuevoTour[key]);
                    }
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

            console.log("✅ Tour creado:", response.data);
            cerrarModales();
            await recargarTours();
        } catch (error) {
            console.error("❌ Error al crear tour:", error);
            throw error;
        }
    };

    const actualizarTour = async (tourActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.keys(tourActualizado).forEach(key => {
                if (tourActualizado[key] !== null && tourActualizado[key] !== undefined) {
                    if (key === 'idiomas_disponibles') {
                        formData.append(key, JSON.stringify(tourActualizado[key]));
                    } else {
                        formData.append(key, tourActualizado[key]);
                    }
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

            console.log("✅ Tour actualizado:", response.data);
            cerrarModales();
            await recargarTours();
        } catch (error) {
            console.error("❌ Error al actualizar tour:", error);
            throw error;
        }
    };

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
                />

                {/* ✅ Modal AGREGAR */}
                {modalAgregarAbierto && (
                    <ModalAgregarTours
                        onGuardar={agregarTour}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}

                {/* ✅ Modal EDITAR */}
                {modalEditarAbierto && tourAEditar && (
                    <ModalEditarTours
                        tour={tourAEditar}
                        onGuardar={actualizarTour}
                        onCerrar={cerrarModales}
                        proveedores={proveedores}
                    />
                )}

                {/* ✅ Modal VER */}
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