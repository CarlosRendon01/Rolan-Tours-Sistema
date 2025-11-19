import React, { useState } from 'react';
import TablaHospedaje from './Componentes/TablaHospedaje';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './HospedajePrincipal.css';
import ModalAgregarHospedaje from './ModalesHospedaje/ModalAgregarHospedaje';
import ModalVerHospedaje from './ModalesHospedaje/ModalVerHospedaje';
import ModalEditarHospedaje from './ModalesHospedaje/ModalEditarHospedaje';
import { modalEliminarHospedaje } from './ModalesHospedaje/ModalEliminarHospedaje';

const HospedajePrincipal = () => {
    // ✅ SOLUCIÓN: Agregar el estado de proveedores
    const [proveedores] = useState([
        { id: 1, nombre: 'Hotel Playa Azul' },
        { id: 2, nombre: 'Cabañas del Bosque' },
        { id: 3, nombre: 'Hostal Viajero' },
        { id: 4, nombre: 'Villas Paraíso' },
        { id: 5, nombre: 'Apartamentos Modernos SA' }
    ]);

    // Estado para almacenar los hospedajes
    const [hospedajes, setHospedajes] = useState([
        {
            id: 1,
            codigo_servicio: 'HOS-HOT-001',
            nombre_servicio: 'Habitación Doble Deluxe',
            tipo_hospedaje: 'Hotel',
            tipo_habitacion: 'Doble',
            capacidad: 2,
            descripcion_servicio: 'Habitación amplia con vista al mar, cama king size, baño privado con tina, TV pantalla plana, minibar y balcón privado.',
            tipo_paquete: 'Por noche',
            duracion_paquete: '1 noche',
            precio_base: 1200.00,
            moneda: 'MXN',
            incluye: 'Desayuno buffet, WiFi, estacionamiento, acceso a alberca y gimnasio, toallas de playa',
            restricciones: 'Check-in: 15:00 hrs, Check-out: 12:00 hrs, No se permiten mascotas, Cancelación gratuita 48 hrs antes',
            empresa_proveedora_id: 1,
            nombre_proveedor: 'Hotel Playa Azul',
            ubicacion_hospedaje: 'Av. Costera Miguel Alemán #100, Acapulco',
            servicios_instalaciones: 'Alberca, gimnasio, restaurante, bar, spa, sala de conferencias',
            disponibilidad: true,
            foto_servicio: null,
            estado: 'Activo',
            fecha_registro: '2025-01-10'
        },
        {
            id: 2,
            codigo_servicio: 'HOS-CAB-002',
            nombre_servicio: 'Cabaña Romántica',
            tipo_hospedaje: 'Cabaña',
            tipo_habitacion: 'Suite',
            capacidad: 2,
            descripcion_servicio: 'Cabaña acogedora en el bosque con chimenea, jacuzzi privado, terraza con vista panorámica y decoración rústica elegante.',
            tipo_paquete: 'Por estancia',
            duracion_paquete: '2 noches / 3 días',
            precio_base: 3500.00,
            moneda: 'MXN',
            incluye: 'Desayuno incluido, leña para chimenea, botella de vino, cena romántica primera noche',
            restricciones: 'Mínimo 2 noches, Check-in: 14:00 hrs, Check-out: 13:00 hrs, Solo adultos',
            empresa_proveedora_id: 2,
            nombre_proveedor: 'Cabañas del Bosque',
            ubicacion_hospedaje: 'Carretera Nacional km 45, Valle de Bravo',
            servicios_instalaciones: 'Chimenea, jacuzzi, terraza, estacionamiento privado',
            disponibilidad: true,
            foto_servicio: null,
            estado: 'Activo',
            fecha_registro: '2025-01-15'
        },
        {
            id: 3,
            codigo_servicio: 'HOS-HOS-003',
            nombre_servicio: 'Habitación Compartida Económica',
            tipo_hospedaje: 'Hostal',
            tipo_habitacion: 'Compartida',
            capacidad: 4,
            descripcion_servicio: 'Habitación compartida con literas cómodas, casilleros individuales, baño compartido y área común para convivir.',
            tipo_paquete: 'Por persona',
            duracion_paquete: 'Por noche',
            precio_base: 250.00,
            moneda: 'MXN',
            incluye: 'WiFi, ropa de cama, casillero con candado, cocina compartida, área de descanso',
            restricciones: 'Check-in: 14:00-22:00 hrs, Check-out: 11:00 hrs, No se permiten visitas después de las 22:00 hrs',
            empresa_proveedora_id: 3,
            nombre_proveedor: 'Hostal Viajero',
            ubicacion_hospedaje: 'Calle Hidalgo #45, Centro Histórico',
            servicios_instalaciones: 'Cocina compartida, sala de estar, terraza, lavandería',
            disponibilidad: true,
            foto_servicio: null,
            estado: 'Activo',
            fecha_registro: '2025-02-01'
        },
        {
            id: 4,
            codigo_servicio: 'HOS-VIL-004',
            nombre_servicio: 'Villa Familiar con Alberca',
            tipo_hospedaje: 'Villa',
            tipo_habitacion: 'Familiar',
            capacidad: 8,
            descripcion_servicio: 'Villa amplia de 4 recámaras con alberca privada, jardín, parrilla y área de juegos infantiles. Ideal para familias.',
            tipo_paquete: 'Por propiedad',
            duracion_paquete: 'Fin de semana (2 noches)',
            precio_base: 8500.00,
            moneda: 'MXN',
            incluye: 'Alberca privada, parrilla, jardín, 4 recámaras, cocina equipada, estacionamiento 3 autos',
            restricciones: 'Depósito reembolsable $2000, Check-in: 16:00 hrs, Check-out: 12:00 hrs, Máximo 10 personas',
            empresa_proveedora_id: 4,
            nombre_proveedor: 'Villas Paraíso',
            ubicacion_hospedaje: 'Fraccionamiento Las Palmas #200, Cuernavaca',
            servicios_instalaciones: 'Alberca privada, jardín, parrilla, área de juegos, cochera techada',
            disponibilidad: true,
            foto_servicio: null,
            estado: 'Activo',
            fecha_registro: '2025-02-10'
        },
        {
            id: 5,
            codigo_servicio: 'HOS-APT-005',
            nombre_servicio: 'Apartamento Ejecutivo',
            tipo_hospedaje: 'Apartamento',
            tipo_habitacion: 'Individual',
            capacidad: 1,
            descripcion_servicio: 'Apartamento moderno totalmente equipado, ideal para ejecutivos. Incluye área de trabajo, cocina integral y balcón.',
            tipo_paquete: 'Por mes',
            duracion_paquete: '30 días',
            precio_base: 15000.00,
            moneda: 'MXN',
            incluye: 'Servicios incluidos (agua, luz, internet), cocina equipada, TV cable, servicio de limpieza semanal',
            restricciones: 'Contrato mínimo 1 mes, Depósito 1 mes de renta, No se permiten mascotas',
            empresa_proveedora_id: 5,
            nombre_proveedor: 'Apartamentos Modernos SA',
            ubicacion_hospedaje: 'Torre Corporativa, Piso 15, Polanco',
            servicios_instalaciones: 'Gimnasio, business center, estacionamiento, seguridad 24/7',
            disponibilidad: false,
            foto_servicio: null,
            estado: 'En mantenimiento',
            fecha_registro: '2025-02-15'
        }
    ]);

    // Estados para controlar los modales (preparados para el futuro)
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [hospedajeSeleccionado, setHospedajeSeleccionado] = useState(null);

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
            eliminarHospedaje(hospedaje.id);
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
    const agregarHospedaje = (nuevoHospedaje) => {
        const hospedajeConId = {
            ...nuevoHospedaje,
            id: hospedajes.length > 0 ? Math.max(...hospedajes.map(h => h.id)) + 1 : 1,
            fecha_registro: new Date().toISOString().split('T')[0]
        };
        setHospedajes([...hospedajes, hospedajeConId]);
        cerrarModales();
    };

    // Función para actualizar hospedaje
    const actualizarHospedaje = (hospedajeActualizado) => {
        setHospedajes(hospedajes.map(h =>
            h.id === hospedajeActualizado.id ? hospedajeActualizado : h
        ));
        cerrarModales();
    };

    // Función para eliminar hospedaje
    const eliminarHospedaje = (id) => {
        setHospedajes(hospedajes.filter(h => h.id !== id));
        cerrarModales();
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