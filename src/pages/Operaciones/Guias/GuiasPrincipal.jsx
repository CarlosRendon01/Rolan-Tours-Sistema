import React, { useState } from 'react';
import TablaGuias from './Componentes/TablaGuias';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './GuiasPrincipal.css';
import ModalAgregarGuia from './ModalesGuias/ModalAgregarGuia';
import ModalVerGuia from './ModalesGuias/ModalVerGuia';
import ModalEditarGuia from './ModalesGuias/ModalEditarGuia';
import { modalEliminarGuia } from './ModalesGuias/ModalEliminarGuia';

const GuiasPrincipal = () => {
    // Estado para almacenar los guías
    const [guias, setGuias] = useState([
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
    const [guiaSeleccionado, setGuiaSeleccionado] = useState(null);

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
        const confirmado = await modalEliminarGuia(guia, eliminarGuia);
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
    const agregarGuia = (nuevoGuia) => {
        console.log('📥 Datos recibidos del modal:', nuevoGuia);

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
        const idiomasArray = nuevoGuia.idiomas
            ? nuevoGuia.idiomas.split(',').map(idioma => idioma.trim())
            : [];

        const guiaConId = {
            id: guias.length > 0 ? Math.max(...guias.map(g => g.id)) + 1 : 1,
            nombre: nuevoGuia.nombre,
            apellidoPaterno: nuevoGuia.apellido_paterno,
            apellidoMaterno: nuevoGuia.apellido_materno,
            edad: calcularEdad(nuevoGuia.fecha_nacimiento),
            genero: 'No especificado', // Puedes agregar este campo al modal si lo necesitas
            idiomas: idiomasArray,
            telefonoPersonal: nuevoGuia.telefono,
            telefonoFamiliar: nuevoGuia.telefono_emergencia,
            telefonoEmpresa: '', // Puedes agregar este campo si lo necesitas
            correoElectronico: nuevoGuia.email,
            foto: nuevoGuia.documentos.foto_guia,
            ine: nuevoGuia.documentos.foto_ine,
            certificado: nuevoGuia.documentos.foto_certificaciones,
            activo: true,
            comentarios: nuevoGuia.comentarios || '',
            // Campos adicionales del nuevo modal
            fechaNacimiento: nuevoGuia.fecha_nacimiento,
            rfc: nuevoGuia.rfc,
            curp: nuevoGuia.curp,
            nss: nuevoGuia.nss,
            domicilio: nuevoGuia.domicilio,
            ciudad: nuevoGuia.ciudad,
            estado: nuevoGuia.estado,
            codigoPostal: nuevoGuia.codigo_postal,
            tipoSangre: nuevoGuia.tipo_sangre,
            contactoEmergencia: nuevoGuia.contacto_emergencia,
            telefonoEmergencia: nuevoGuia.telefono_emergencia,
            experienciaAnos: nuevoGuia.experiencia_anos,
            especialidades: nuevoGuia.especialidades,
            costoDia: nuevoGuia.costo_dia,
            documentos: nuevoGuia.documentos
        };

        console.log('✅ Guía formateado para agregar:', guiaConId);
        setGuias([...guias, guiaConId]);
        cerrarModales();
    };

    // Función para actualizar guía
    const actualizarGuia = (guiaActualizado) => {
        setGuias(guias.map(g =>
            g.id === guiaActualizado.id ? guiaActualizado : g
        ));
        cerrarModales();
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