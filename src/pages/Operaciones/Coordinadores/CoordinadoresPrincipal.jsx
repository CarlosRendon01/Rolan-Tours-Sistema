import React, { useState } from 'react';
import TablaCoordinadores from './Componentes/TablaCoordinadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import ModalAgregarCoordinador from './ModalesCoordinadores/ModalAgregarCoordinador';
import ModalVerCoordinador from './ModalesCoordinadores/ModalVerCoordinador';
import ModalEditarCoordinador from './ModalesCoordinadores/ModalEditarCoordinador';
import { modalEliminarCoordinador } from './ModalesCoordinadores/Modaleliminarcoordinador';
import './CoordinadoresPrincipal.css';
// import ModalAgregarCoordinador from './ModalesCoordinadores/ModalAgregarCoordinador';
// import ModalVerCoordinador from './ModalesCoordinadores/ModalVerCoordinador';
// import ModalEditarCoordinador from './ModalesCoordinadores/ModalEditarCoordinador';
// import { modalEliminarCoordinador } from './ModalesCoordinadores/ModalEliminarCoordinador';

const CoordinadoresPrincipal = () => {
    // Estado para almacenar los coordinadores
    const [coordinadores, setCoordinadores] = useState([
        {
            id: 1,
            nombre: 'Pedro',
            apellido_paterno: 'Martínez',
            apellido_materno: 'Flores',
            fecha_nacimiento: '1985-06-15',
            telefono: '5551112222',
            email: 'pedro.martinez@email.com',
            ciudad: 'Ciudad de México',
            estado: 'CDMX',
            nss: '12345678901',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'María Flores',
            telefono_emergencia: '5553334444',
            costo_dia: 1200,
            idiomas: 'Español, Inglés',
            experiencia_anos: 5,
            especialidades: 'Logística, Gestión de equipos',
            certificacion_oficial: true,
            comentarios: 'Coordinador con excelente organización',
            foto_coordinador: null,
            foto_ine: null,
            foto_certificaciones: null,
            foto_comprobante_domicilio: null,
            contrato_laboral: null
        },
        {
            id: 2,
            nombre: 'Laura',
            apellido_paterno: 'Gómez',
            apellido_materno: 'Reyes',
            fecha_nacimiento: '1992-03-22',
            telefono: '5552223333',
            email: 'laura.gomez@email.com',
            ciudad: 'Guadalajara',
            estado: 'Jalisco',
            nss: '23456789012',
            institucion_seguro: 'ISSSTE',
            contacto_emergencia: 'Roberto Gómez',
            telefono_emergencia: '5554445555',
            costo_dia: 1000,
            idiomas: 'Español',
            experiencia_anos: 3,
            especialidades: 'Coordinación de rutas',
            certificacion_oficial: true,
            comentarios: 'Especialista en logística',
            foto_coordinador: null,
            foto_ine: null,
            foto_certificaciones: null,
            foto_comprobante_domicilio: null,
            contrato_laboral: null
        },
        {
            id: 3,
            nombre: 'Roberto',
            apellido_paterno: 'Díaz',
            apellido_materno: 'Castro',
            fecha_nacimiento: '1978-11-08',
            telefono: '5553334444',
            email: 'roberto.diaz@email.com',
            ciudad: 'Monterrey',
            estado: 'Nuevo León',
            nss: '34567890123',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'Ana Castro',
            telefono_emergencia: '5556667777',
            costo_dia: 1500,
            idiomas: 'Español, Inglés, Francés',
            experiencia_anos: 8,
            especialidades: 'Gestión operativa, Planificación',
            certificacion_oficial: true,
            comentarios: 'Amplia experiencia en coordinación',
            foto_coordinador: null,
            foto_ine: null,
            foto_certificaciones: null,
            foto_comprobante_domicilio: null,
            contrato_laboral: null
        },
        {
            id: 4,
            nombre: 'Sofía',
            apellido_paterno: 'Morales',
            apellido_materno: 'Vega',
            fecha_nacimiento: '1995-09-14',
            telefono: '5554445555',
            email: 'sofia.morales@email.com',
            ciudad: 'Puebla',
            estado: 'Puebla',
            nss: '45678901234',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'Luis Morales',
            telefono_emergencia: '5558889999',
            costo_dia: 900,
            idiomas: 'Español, Inglés',
            experiencia_anos: 2,
            especialidades: 'Atención al cliente',
            certificacion_oficial: false,
            comentarios: 'Proactiva y con buen manejo de personal',
            foto_coordinador: null,
            foto_ine: null,
            foto_certificaciones: null,
            foto_comprobante_domicilio: null,
            contrato_laboral: null
        },
        {
            id: 5,
            nombre: 'Fernando',
            apellido_paterno: 'López',
            apellido_materno: 'Hernández',
            fecha_nacimiento: '1988-01-30',
            telefono: '5555556666',
            email: 'fernando.lopez@email.com',
            ciudad: 'Querétaro',
            estado: 'Querétaro',
            nss: '56789012345',
            institucion_seguro: 'ISSSTE',
            contacto_emergencia: 'Carmen Hernández',
            telefono_emergencia: '5559990000',
            costo_dia: 1100,
            idiomas: 'Español',
            experiencia_anos: 4,
            especialidades: 'Control de calidad, Supervisión',
            certificacion_oficial: true,
            comentarios: 'Excelente supervisor de operaciones',
            foto_coordinador: null,
            foto_ine: null,
            foto_certificaciones: null,
            foto_comprobante_domicilio: null,
            contrato_laboral: null
        }
    ]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [coordinadorSeleccionado, setCoordinadorSeleccionado] = useState(null);

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
        const confirmado = await modalEliminarCoordinador(coordinador, async () => {
            eliminarCoordinador(coordinador.id);
        });

        if (confirmado) {
            console.log('✅ Coordinador eliminado');
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
    const agregarCoordinador = (nuevoCoordinador) => {
        const coordinadorConId = {
            ...nuevoCoordinador,
            id: coordinadores.length > 0 ? Math.max(...coordinadores.map(c => c.id)) + 1 : 1,

            apellido_paterno: nuevoCoordinador.apellidoPaterno,
            apellido_materno: nuevoCoordinador.apellidoMaterno,
            fecha_nacimiento: '', // Calcular desde edad si lo necesitas
            telefono: nuevoCoordinador.telefonoPersonal,
            email: nuevoCoordinador.correoElectronico,
            telefono_emergencia: nuevoCoordinador.telefonoEmergencia,

            ciudad: '',
            estado: '',
            nss: '',
            institucion_seguro: '',
            contacto_emergencia: '',
            costo_dia: 0,
            idiomas: '',
            experiencia_anos: nuevoCoordinador.antiguedad || 0,
            especialidades: nuevoCoordinador.areaAsignada || '',
            certificacion_oficial: false,
            comentarios: nuevoCoordinador.comentarios || '',
            foto_coordinador: nuevoCoordinador.foto,
            foto_ine: nuevoCoordinador.ine
        };
        setCoordinadores([...coordinadores, coordinadorConId]);
        cerrarModales();
    };

    // Función para actualizar coordinador
    const actualizarCoordinador = (coordinadorActualizado) => {
        setCoordinadores(coordinadores.map(coord =>
            coord.id === coordinadorActualizado.id ? coordinadorActualizado : coord
        ));
        cerrarModales();
    };

    // Función para eliminar coordinador
    const eliminarCoordinador = (id) => {
        setCoordinadores(coordinadores.filter(coord => coord.id !== id));
        cerrarModales();
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