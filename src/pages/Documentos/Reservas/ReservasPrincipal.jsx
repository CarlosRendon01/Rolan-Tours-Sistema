import React, { useState } from 'react';
import TablaReservas from './Componentes/TablaReservas';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './ReservasPrincipal.css';
import ModalAgregarReserva from './ModalesReservas/ModalAgregarReserva';
import ModalVerReserva from './ModalesReservas/ModalVerReserva';
import ModalEditarReserva from './ModalesReservas/ModalEditarReserva';
import { modalEliminarReserva } from './ModalesReservas/ModalEliminarReserva';

const ReservasPrincipal = () => {
    // Estado para almacenar los guías
    const [reservas, setReservas] = useState([
        {
            id: 1,
            nombre: 'María',
            apellidoPaterno: 'González',
            apellidoMaterno: 'Ramírez',
            edad: 32,
            genero: 'Femenino',
            idiomas: ['Español', 'Inglés', 'Francés'],
            telefonoPersonal: '5551234567',
            telefonoFamiliar: '5559876543',
            telefonoEmpresa: '5556547890',
            correoElectronico: 'maria.gonzalez@email.com',
            foto: null,
            ine: null,
            certificado: null,
            activo: true,
            comentarios: 'Guía certificada con 8 años de experiencia'
        },
        {
            id: 2,
            nombre: 'Carlos',
            apellidoPaterno: 'Hernández',
            apellidoMaterno: 'López',
            edad: 28,
            genero: 'Masculino',
            idiomas: ['Español', 'Inglés', 'Alemán'],
            telefonoPersonal: '5552345678',
            telefonoFamiliar: '5558765432',
            telefonoEmpresa: '5557654321',
            correoElectronico: 'carlos.hernandez@email.com',
            foto: null,
            ine: null,
            certificado: null,
            activo: true,
            comentarios: 'Especialista en turismo cultural'
        },
        {
            id: 3,
            nombre: 'Ana',
            apellidoPaterno: 'Martínez',
            apellidoMaterno: 'Pérez',
            edad: 35,
            genero: 'Femenino',
            idiomas: ['Español', 'Inglés', 'Italiano', 'Portugués'],
            telefonoPersonal: '5553456789',
            telefonoFamiliar: '5557654321',
            telefonoEmpresa: '5558765432',
            correoElectronico: 'ana.martinez@email.com',
            foto: null,
            ine: null,
            certificado: null,
            activo: true,
            comentarios: 'Guía políglota con experiencia en turismo europeo'
        },
        {
            id: 4,
            nombre: 'Roberto',
            apellidoPaterno: 'Sánchez',
            apellidoMaterno: 'García',
            edad: 41,
            genero: 'Masculino',
            idiomas: ['Español', 'Inglés'],
            telefonoPersonal: '5554567890',
            telefonoFamiliar: '5556543210',
            telefonoEmpresa: '5559876543',
            correoElectronico: 'roberto.sanchez@email.com',
            foto: null,
            ine: null,
            certificado: null,
            activo: true,
            comentarios: 'Experto en historia y arqueología mexicana'
        },
        {
            id: 5,
            nombre: 'Laura',
            apellidoPaterno: 'Torres',
            apellidoMaterno: 'Ramírez',
            edad: 26,
            genero: 'Femenino',
            idiomas: ['Español', 'Inglés', 'Japonés'],
            telefonoPersonal: '5555678901',
            telefonoFamiliar: '5555432109',
            telefonoEmpresa: '5558901234',
            correoElectronico: 'laura.torres@email.com',
            foto: null,
            ine: null,
            certificado: null,
            activo: true,
            comentarios: 'Especialista en turismo asiático'
        }
    ]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [reservaSeleccionado, setReservaSeleccionado] = useState(null);

    // Funciones para manejar los modales
    const manejarVer = (reserva) => {
        setReservaSeleccionado(reserva);
        setModalVerAbierto(true);
        console.log('Ver guía:', reserva);
    };

    const manejarEditar = (reserva) => {
        setReservaSeleccionado(reserva);
        setModalEditarAbierto(true);
        console.log('Editar guía:', reserva);
    };

    const manejarEliminar = async (reserva) => {
        const confirmado = await modalEliminarReserva(reserva, eliminarReserva);
        if (confirmado) {
            console.log('Guía eliminado:', reserva);
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
        setReservaSeleccionado(null);
    };

    // Función para agregar guía
    const agregarReserva = (nuevoReserva) => {
        console.log('📥 Datos recibidos del modal:', nuevoReserva);

        // Calcular la edad a partir de la fecha de nacimiento
        const calcularEdad = (fechaNacimiento) => {
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        };

        // Convertir idiomas de string a array
        const idiomasArray = nuevoReserva.idiomas
            ? nuevoReserva.idiomas.split(',').map(idioma => idioma.trim())
            : [];

        const reservaConId = {
            id: reservas.length > 0 ? Math.max(...reservas.map(g => g.id)) + 1 : 1,
            nombre: nuevoReserva.nombre,
            apellidoPaterno: nuevoReserva.apellido_paterno,
            apellidoMaterno: nuevoReserva.apellido_materno,
            edad: calcularEdad(nuevoReserva.fecha_nacimiento),
            genero: 'No especificado', // Puedes agregar este campo al modal si lo necesitas
            idiomas: idiomasArray,
            telefonoPersonal: nuevoReserva.telefono,
            telefonoFamiliar: nuevoReserva.telefono_emergencia,
            telefonoEmpresa: '', // Puedes agregar este campo si lo necesitas
            correoElectronico: nuevoReserva.email,
            foto: nuevoReserva.documentos.foto_reserva,
            ine: nuevoReserva.documentos.foto_ine,
            certificado: nuevoReserva.documentos.foto_certificaciones,
            activo: true,
            comentarios: nuevoReserva.comentarios || '',
            // Campos adicionales del nuevo modal
            fechaNacimiento: nuevoReserva.fecha_nacimiento,
            rfc: nuevoReserva.rfc,
            curp: nuevoReserva.curp,
            nss: nuevoReserva.nss,
            domicilio: nuevoReserva.domicilio,
            ciudad: nuevoReserva.ciudad,
            estado: nuevoReserva.estado,
            codigoPostal: nuevoReserva.codigo_postal,
            tipoSangre: nuevoReserva.tipo_sangre,
            contactoEmergencia: nuevoReserva.contacto_emergencia,
            telefonoEmergencia: nuevoReserva.telefono_emergencia,
            experienciaAnos: nuevoReserva.experiencia_anos,
            especialidades: nuevoReserva.especialidades,
            costoDia: nuevoReserva.costo_dia,
            documentos: nuevoReserva.documentos
        };

        console.log('✅ Guía formateado para agregar:', reservaConId);
        setReservas([...reservas, reservaConId]);
        cerrarModales();
    };

    // Función para actualizar guía
    const actualizarReserva = (reservaActualizado) => {
        setReservas(reservas.map(g =>
            g.id === reservaActualizado.id ? reservaActualizado : g
        ));
        cerrarModales();
    };

    // Función para eliminar guía
    const eliminarReserva = (id) => {
        setReservas(reservas.filter(g => g.id !== id));
        cerrarModales();
    };

    return (
        <PrincipalComponente>
            <div className="reservas-principal">
                <TablaReservas
                    reservas={reservas}
                    setReservas={setReservas}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                />

                {/* Modal VER */}
                {modalVerAbierto && reservaSeleccionado && (
                    <ModalVerReserva
                        reserva={reservaSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}


                {/* Modal EDITAR */}
                {modalEditarAbierto && reservaSeleccionado && (
                    <ModalEditarReserva
                        reserva={reservaSeleccionado}
                        onGuardar={actualizarReserva}
                        onCerrar={cerrarModales}
                    />
                )}
                {/* Modal AGREGAR */}
                {modalAgregarAbierto && (
                    <ModalAgregarReserva
                        onGuardar={agregarReserva}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default ReservasPrincipal;