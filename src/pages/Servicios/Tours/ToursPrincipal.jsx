import React, { useState } from 'react';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import TablaTours from './Componentes/TablaTours';
import ModalAgregarTours from './ModalesTours/ModalAgregarTours';
import ModalEditarTours from './ModalesTours/ModalEditarTours';
import ModalVerTours from './ModalesTours/ModalVerTours';
import { modalEliminarTour } from './ModalesTours/ModalEliminarTours'; // ✅ NUEVO: Importar modal eliminar
import './ToursPrincipal.css';

const ToursPrincipal = () => {
    // ✅ Lista de proveedores
    const [proveedores] = useState([
        { id: 1, nombre: 'Tours Oaxaca SA' },
        { id: 2, nombre: 'Cultura Viva SA' },
        { id: 3, nombre: 'Sabores SA' },
        { id: 4, nombre: 'Aventura Extrema SA' },
        { id: 5, nombre: 'Tradiciones SA' },
        { id: 6, nombre: 'Rutas Ancestrales SA' }
    ]);

    // Estado para los tours con datos de ejemplo
    const [tours, setTours] = useState([
        {
            codigo_tour: 'TUR-001',
            nombre_tour: 'Cascadas de Hierve el Agua',
            tipo_tour: 'Ecoturismo',
            duracion_tour: '8 horas',
            capacidad_maxima: 15,
            descripcion_tour: 'Visita a las impresionantes cascadas petrificadas',
            nivel_dificultad: 'Medio',
            idiomas_disponibles: ['Español', 'Inglés'],
            punto_partida: 'Centro de Oaxaca',
            punto_llegada: 'Hierve el Agua',
            hora_salida: '08:00',
            hora_regreso: '16:00',
            tipo_paquete: 'Tour Completo',
            precio_base: 850.00,
            moneda: 'MXN',
            incluye: 'Transporte, Guía, Comida, Entradas',
            no_incluye: 'Bebidas alcohólicas, Propinas',
            descuento_disponible: true,
            iva_incluido: true,
            costo_por_nino: 425.00,
            costo_por_adulto_mayor: 680.00,
            temporada: 'Todo el año',
            operado_por: 'Aventura Oaxaca',
            empresa_proveedora_id: 1,
            nombre_proveedor: 'Tours Oaxaca SA',
            guia_principal: 'Juan Pérez',
            contacto_proveedor: '9511234567',
            ubicacion_salida: 'Zócalo de Oaxaca',
            disponibilidad: 'Diario',
            transporte_incluido: true,
            seguro_incluido: true,
            numero_licencia_guia: 'LIC-001',
            foto_tour: null,
            fecha_registro: '2024-01-15',
            estado: 'activo',
            usuario_registro: 'admin'
        },
        {
            codigo_tour: 'TUR-002',
            nombre_tour: 'Monte Albán y Artesanías',
            tipo_tour: 'Cultural',
            duracion_tour: '6 horas',
            capacidad_maxima: 20,
            descripcion_tour: 'Tour arqueológico con visita a talleres artesanales',
            nivel_dificultad: 'Bajo',
            idiomas_disponibles: ['Español', 'Inglés', 'Francés'],
            punto_partida: 'Hotel Zona Centro',
            punto_llegada: 'Monte Albán',
            hora_salida: '09:00',
            hora_regreso: '15:00',
            tipo_paquete: 'Tour Medio Día',
            precio_base: 650.00,
            moneda: 'MXN',
            incluye: 'Transporte, Guía certificado, Entradas',
            no_incluye: 'Alimentos, Compras personales',
            descuento_disponible: true,
            iva_incluido: true,
            costo_por_nino: 325.00,
            costo_por_adulto_mayor: 520.00,
            temporada: 'Todo el año',
            operado_por: 'Cultura Viva Tours',
            empresa_proveedora_id: 2,
            nombre_proveedor: 'Cultura Viva SA',
            guia_principal: 'María López',
            contacto_proveedor: '9512345678',
            ubicacion_salida: 'Hotel Parador',
            disponibilidad: 'Lunes a Sábado',
            transporte_incluido: true,
            seguro_incluido: true,
            numero_licencia_guia: 'LIC-002',
            foto_tour: null,
            fecha_registro: '2024-01-20',
            estado: 'activo',
            usuario_registro: 'admin'
        },
        {
            codigo_tour: 'TUR-003',
            nombre_tour: 'Mercados y Gastronomía Oaxaqueña',
            tipo_tour: 'Gastronómico',
            duracion_tour: '4 horas',
            capacidad_maxima: 12,
            descripcion_tour: 'Recorrido por mercados tradicionales con degustaciones',
            nivel_dificultad: 'Bajo',
            idiomas_disponibles: ['Español', 'Inglés'],
            punto_partida: 'Mercado Benito Juárez',
            punto_llegada: 'Mercado 20 de Noviembre',
            hora_salida: '10:00',
            hora_regreso: '14:00',
            tipo_paquete: 'Tour Gastronómico',
            precio_base: 550.00,
            moneda: 'MXN',
            incluye: 'Guía, Degustaciones, Bebidas tradicionales',
            no_incluye: 'Compras personales, Comida completa',
            descuento_disponible: false,
            iva_incluido: true,
            costo_por_nino: 275.00,
            costo_por_adulto_mayor: 440.00,
            temporada: 'Todo el año',
            operado_por: 'Sabores de Oaxaca',
            empresa_proveedora_id: 3,
            nombre_proveedor: 'Sabores SA',
            guia_principal: 'Carlos Ramírez',
            contacto_proveedor: '9513456789',
            ubicacion_salida: 'Mercado Benito Juárez',
            disponibilidad: 'Martes a Domingo',
            transporte_incluido: false,
            seguro_incluido: false,
            numero_licencia_guia: 'LIC-003',
            foto_tour: null,
            fecha_registro: '2024-02-01',
            estado: 'activo',
            usuario_registro: 'admin'
        },
        {
            codigo_tour: 'TUR-004',
            nombre_tour: 'Pueblos Mancomunados - Senderismo',
            tipo_tour: 'Aventura',
            duracion_tour: '2 días',
            capacidad_maxima: 10,
            descripcion_tour: 'Expedición de senderismo en la Sierra Norte',
            nivel_dificultad: 'Alto',
            idiomas_disponibles: ['Español'],
            punto_partida: 'Oaxaca Centro',
            punto_llegada: 'Pueblos Mancomunados',
            hora_salida: '07:00',
            hora_regreso: '18:00',
            tipo_paquete: 'Tour Aventura',
            precio_base: 2500.00,
            moneda: 'MXN',
            incluye: 'Transporte, Guía, Hospedaje, Alimentos, Seguro',
            no_incluye: 'Equipo personal, Propinas',
            descuento_disponible: true,
            iva_incluido: true,
            costo_por_nino: 1250.00,
            costo_por_adulto_mayor: 2000.00,
            temporada: 'Alta',
            operado_por: 'Aventura Extrema',
            empresa_proveedora_id: 4,
            nombre_proveedor: 'Aventura Extrema SA',
            guia_principal: 'Roberto Sánchez',
            contacto_proveedor: '9514567890',
            ubicacion_salida: 'Terminal ADO',
            disponibilidad: 'Fines de semana',
            transporte_incluido: true,
            seguro_incluido: true,
            numero_licencia_guia: 'LIC-004',
            foto_tour: null,
            fecha_registro: '2024-02-10',
            estado: 'mantenimiento',
            usuario_registro: 'admin'
        }
    ]);

    // ✅ Estados para controlar los modales
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [tourAEditar, setTourAEditar] = useState(null);
    const [tourAVer, setTourAVer] = useState(null);

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
            // Aquí iría la lógica de eliminación real (API call)
            // Por ahora solo actualizamos el estado
            setTours(prevTours => prevTours.filter(t => t.codigo_tour !== tourAEliminar.codigo_tour));
        });

        if (confirmado) {
            console.log('✅ Tour eliminado exitosamente');
        }
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
    const agregarTour = (nuevoTour) => {
        setTours([...tours, nuevoTour]);
        cerrarModales();
    };

    // ✅ Función para actualizar tour
    const actualizarTour = (tourActualizado) => {
        setTours(prevTours => 
            prevTours.map(t => 
                t.codigo_tour === tourActualizado.codigo_tour ? tourActualizado : t
            )
        );
        console.log('✅ Tour actualizado en el estado:', tourActualizado);
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